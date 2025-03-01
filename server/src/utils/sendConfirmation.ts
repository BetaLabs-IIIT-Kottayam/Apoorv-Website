import { StatusCodes } from "http-status-codes";
import { PopulatedOrder } from "../controllers/orderController";
import generateInvoice from "./generateInvoice";
import transporter from "./mailService";

export const sendConfirmation = async (order: PopulatedOrder, res: any) => {
  const invoice = generateInvoice(order);
  const pdfBuffer = invoice.output("arraybuffer");

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order?.buyerDetails.email,
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
                    <p>Dear ${order?.buyerDetails.firstName} ${
      order?.buyerDetails.lastName
    },</p>
                    
                    <p>Thank you for your order! We're excited to process your purchase.</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> ${order?._id}</p>
                        <div class="secret-code">
                            <h4>Your Secret Code</h4>
                            <h3>${order?.secretCode}</h3>
                            <small>Please keep this code safe for future reference</small>
                        </div>
                        <p><strong>Total Amount:</strong> ₹${
                          order?.totalAmount
                        }</p>
                    </div>
    
                    <h3>Order Items</h3>
                    ${order?.items
                      .map(
                        (item) => `
                        <div class="item">
                            <h4>${item.merchId.name}</h4>
                            <p>
                                <strong>Size:</strong> ${item.size}<br>
                                <strong>Quantity:</strong> ${item.quantity}<br>
                                <strong>Price:</strong> ₹${item.price}<br>
                                <strong>Total:</strong> ₹${
                                  item.price * item.quantity
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
    .json({ order: order, invoice: Buffer.from(pdfBuffer).toString("base64") });
};
