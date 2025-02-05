import mongoose, { Document, Schema } from 'mongoose';

// Buyer details interface
interface IBuyerDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface IOrderItem {
    merchId: mongoose.Types.ObjectId;
    size: 'S' | 'M' | 'L';
    quantity: number;
    price: number;
    color: string;
}

interface IOrder extends Document {
    items: IOrderItem[];
    totalAmount: number;
    secretCode: string;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    paidAt?: Date;
    expiredAt?: Date;
    buyerDetails: IBuyerDetails;  // Added buyer details
}

const generateSecretCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const orderSchema: Schema = new Schema({
    items: [{
        merchId: { type: mongoose.Types.ObjectId, ref: 'Merch', required: true },
        size: { type: String, enum: ['S', 'M', 'L'], required: true },
        color: { type: String, required: true },
        // variant: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    secretCode: { type: String },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Expired', 'Delivered'],
        default: 'Pending',
    },
    buyerDetails: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email'
            ]
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    paidAt: Date,
    expiredAt: Date,
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;