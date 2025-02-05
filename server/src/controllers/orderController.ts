import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import Order from "../models/Order";
import Merch from "../models/Merch";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Razorpay from "razorpay";

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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !buyerDetails[field]);

    if (missingFields.length > 0) {
        throw new BadRequestError(`Missing required buyer details: ${missingFields.join(', ')}`);
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
        currency: 'INR',
        // payment_capture: 1,
    });

    // Create pre-order in database
    const order = await Order.create({
        items,
        totalAmount,
        razorpayOrderId: razorpayOrder.id,
        status: 'Pending',
        buyerDetails: {
            firstName: buyerDetails.firstName,
            lastName: buyerDetails.lastName,
            email: buyerDetails.email,
            phone: buyerDetails.phone
        }
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
            key: process.env.RAZORPAY_KEY_ID // Frontend needs this
        }
    });
};

const verifyPayment = async (req: Request, res: Response) => {
    const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new BadRequestError("Missing payment verification details");
    }

    // Find the order
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
        throw new NotFoundError(`No order found with Razorpay ID ${razorpayOrderId}`);
    }

    // Verify payment signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpaySignature) {
        throw new UnauthenticatedError("Invalid payment signature");
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
            status: 'Paid',
            razorpayPaymentId,
            paidAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate('items.merchId');

    res.status(StatusCodes.OK).json({ order: updatedOrder });
};

const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({})
        .populate('items.merchId')
        .sort('-createdAt'); // Latest orders first
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid order ID");
    }

    const order = await Order.findById(id).populate('items.merchId');

    if (!order) {
        throw new NotFoundError(`No order found with id ${id}`);
    }

    res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid order ID");
    }
    if (!status) {
        throw new BadRequestError("Please provide order status");
    }

    const validStatuses = ['Paid', 'Delivered'];
    if (!validStatuses.includes(status)) {
        throw new BadRequestError("Invalid status value");
    }

    const order = await Order.findById(id).populate('items.merchId');
    if (!order) {
        throw new NotFoundError(`No order found with id ${id}`);
    }

    if (status === 'Delivered' && order.status !== 'Paid') {
        throw new BadRequestError("Order must be in 'Paid' status to be marked as 'Delivered'");
    }

    order.status = status;
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    verifyPayment
};