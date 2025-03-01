import { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import Order from "../models/Order";
import Merch from "../models/Merch";
import { StatusCodes } from "http-status-codes";
import mongoose, { Document } from "mongoose";
import Razorpay from "razorpay";
import generateInvoice from "../utils/generateInvoice";
import transporter from "../utils/mailService";
import { sendConfirmation } from "../utils/sendConfirmation";

interface IMerchPhoto {
  data: Buffer;
  contentType: string;
}

interface IMerch extends Document {
  name: string;
  description: string;
  price: number;
  photos: IMerchPhoto[];
  sizes: string[];
  colors: string[];
}

// Types for the Order document
interface IOrderItem {
  merchId: IMerch; // This will be populated with the full Merch document
  size: "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";
  color?: string;
  quantity: number;
  price: number;
}

interface IBuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  buyerDetails: IBuyerDetails;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  secretCode: string;
  paidAt?: Date;
}
export type PopulatedOrder = Document<unknown, {}, IOrder> & IOrder;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface BuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const createOrder = async (req: Request, res: Response) => {
  const { items, buyerDetails } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new BadRequestError("Please provide order items");
  }

  // Validate buyer details
  if (!buyerDetails) {
    throw new BadRequestError("Please provide buyer details");
  }

  // Validate required buyer fields
  const requiredFields = ["firstName", "lastName", "email", "phone"];
  const missingFields = requiredFields.filter((field) => !buyerDetails[field]);

  if (missingFields.length > 0) {
    throw new BadRequestError(
      `Missing required buyer details: ${missingFields.join(", ")}`
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(buyerDetails.email)) {
    throw new BadRequestError("Invalid email format");
  }

  let totalAmount = 0;

  // Validate and process each item
  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.merchId)) {
      throw new BadRequestError(`Invalid merchandise ID: ${item.merchId}`);
    }

    const merch = await Merch.findById(item.merchId);
    if (!merch) {
      throw new NotFoundError(`No merchandise found with id ${item.merchId}`);
    }

    // Add item price to total
    totalAmount += merch.price * item.quantity;
    item.price = merch.price;
  }
  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // Razorpay expects amount in paise
    currency: "INR",
    // payment_capture: 1,
  });

  // Generate a four-digit secret code for easy verification
  const secretCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Create pre-order in database
  const order = await Order.create({
    items,
    totalAmount,
    razorpayOrderId: razorpayOrder.id,
    status: "Pending",
    buyerDetails: {
      firstName: buyerDetails.firstName,
      lastName: buyerDetails.lastName,
      email: buyerDetails.email,
      phone: buyerDetails.phone,
    },
    secretCode: secretCode.toString(),
  });

  // const order = await Order.create({
  //     items,
  //     totalAmount
  // });

  res.status(StatusCodes.CREATED).json({
    order,
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // Frontend needs this
    },
  });
};

const verifyPayment = async (req: Request, res: Response) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new BadRequestError("Missing payment verification details");
  }

  // Find the order
  const order = await Order.findOne({ razorpayOrderId: razorpayOrderId });
  if (!order) {
    throw new NotFoundError(
      `No order found with Razorpay ID ${razorpayOrderId}`
    );
  }

  // Verify payment signature
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature != razorpaySignature) {
    throw new UnauthenticatedError("Invalid payment signature");
  }

  // Update order status
  const updatedOrder = await Order.findByIdAndUpdate(
    order._id,
    {
      status: "Paid",
      razorpayPaymentId,
      paidAt: new Date(),
    },
    { new: true, runValidators: true }
  ).populate<{ items: IOrderItem[] }>("items.merchId");
  const populatedOrder = updatedOrder as PopulatedOrder;

  const invoice = generateInvoice(populatedOrder);
  const pdfBuffer = invoice.output("arraybuffer");

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: updatedOrder?.buyerDetails.email,
    subject: `Order Confirmation - ${order._id}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .header {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        border-bottom: 3px solid #007bff;
                    }
                    .content {
                        padding: 20px;
                    }
                    .order-details {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .secret-code {
                        background-color: #ffeeba;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ffc107;
                        text-align: center;
                        margin: 15px 0;
                    }
                    .item {
                        border-bottom: 1px solid #dee2e6;
                        padding: 10px 0;
                    }
                    .item:last-child {
                        border-bottom: none;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background-color: #f8f9fa;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Order Confirmation</h2>
                </div>
                
                <div class="content">
                    <p>Dear ${updatedOrder?.buyerDetails.firstName} ${updatedOrder?.buyerDetails.lastName
      },</p>
                    
                    <p>Thank you for your order! We're excited to process your purchase.</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> ${updatedOrder?._id}</p>
                        <div class="secret-code">
                            <h4>Your Secret Code</h4>
                            <h3>${updatedOrder?.secretCode}</h3>
                            <small>Please keep this code safe for future reference</small>
                        </div>
                        <p><strong>Total Amount:</strong> ₹${updatedOrder?.totalAmount
      }</p>
                    </div>
    
                    <h3>Order Items</h3>
                    ${updatedOrder?.items
        .map(
          (item) => `
                        <div class="item">
                            <h4>${item.merchId.name}</h4>
                            <p>
                                <strong>Size:</strong> ${item.size}<br>
                                <strong>Quantity:</strong> ${item.quantity}<br>
                                <strong>Price:</strong> ₹${item.price}<br>
                                <strong>Total:</strong> ₹${item.price * item.quantity
            }
                            </p>
                        </div>
                    `
        )
        .join("")}
    
                    <p>Please find your invoice attached to this email.</p>
                </div>
    
                <div class="footer">
                    <p>Best regards,<br>Team Apoorv</p>
                </div>
            </body>
            </html>
        `,
    attachments: [
      {
        filename: `invoice-${order._id}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error here - we don't want to fail the order creation if email fails
  }

  res
    .status(StatusCodes.OK)
    .json({
      order: updatedOrder,
      invoice: Buffer.from(pdfBuffer).toString("base64"),
    });
};

const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Get total count (without populating for efficiency)
  const totalOrders = await Order.countDocuments();

  // Get paginated orders with population
  const orders = await Order.find({})
    .populate("items.merchId")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);
  res.status(StatusCodes.OK).json({
    orders,
    count: orders.length,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page
  });
  // res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid order ID");
  }

  const order = await Order.findById(id).populate("items.merchId");

  if (!order) {
    throw new NotFoundError(`No order found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req: Request, res: Response) => {
  const { status = "Delivered", id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid order ID");
  }
  if (!status) {
    throw new BadRequestError("Please provide order status");
  }

  const validStatuses = ["Paid", "Delivered"];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError("Invalid status value");
  }

  const order = await Order.findById(id).populate("items.merchId");
  if (!order) {
    throw new NotFoundError(`No order found with id ${id}`);
  }

  if (status === "Delivered" && order.status !== "Paid") {
    throw new BadRequestError(
      "Order must be in 'Paid' status to be marked as 'Delivered'"
    );
  }

  order.status = status;
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

const resendInvoice = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid order ID");
  }

  const orderDoc = await Order.findById(id);

  if (!orderDoc) {
    throw new NotFoundError(`No order found with id ${id}`);
  }

  const order = orderDoc as unknown as PopulatedOrder;
  await sendConfirmation(order, res);
};

export {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  resendInvoice,
};
