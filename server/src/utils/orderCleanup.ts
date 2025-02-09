// orderCleanup.ts
import Order from "../models/Order";
import Razorpay from "razorpay";
import { scheduleJob } from "node-schedule";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Timeout period for pending orders (15 minutes)
const PAYMENT_TIMEOUT_MINUTES = 15;

const cleanupPendingOrders = async () => {
  try {
    // Find pending orders that have exceeded timeout
    const pendingOrders = await Order.find({
      status: 'Pending',
      createdAt: {
        $lt: new Date(Date.now() - PAYMENT_TIMEOUT_MINUTES * 60 * 1000)
      }
    });

    console.log(`Found ${pendingOrders.length} expired pending orders`);

    for (const order of pendingOrders) {
      try {
        // Check payment status in Razorpay
        const razorpayOrder = await razorpay.orders.fetch(order.razorpayOrderId);
        
        if (razorpayOrder.status === 'paid') {
          // Payment was successful but webhook/verification failed
          await Order.findByIdAndUpdate(order._id, {
            status: 'Paid',
            paidAt: new Date()
          });
          console.log(`Order ${order._id} was actually paid, updated status`);
        } else {
          // No payment was made, mark as expired
          await Order.findByIdAndUpdate(order._id, {
            status: 'Expired',
            expiredAt: new Date()
          });
          console.log(`Order ${order._id} marked as expired`);
        }
      } catch (error) {
        console.error(`Error processing order ${order._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in cleanup job:', error);
  }
};

// Schedule cleanup job to run every 5 minutes
const startCleanupJob = () => {
  scheduleJob('*/5 * * * *', cleanupPendingOrders);
  console.log('Order cleanup job scheduled');
};

export default startCleanupJob;