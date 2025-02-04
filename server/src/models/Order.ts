import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
    merchId: mongoose.Types.ObjectId;
    size: 'S' | 'M' | 'L';
    quantity: number;
    price: number;
}

interface IOrder extends Document {
    items: IOrderItem[];
    totalAmount: number;
    secretCode: string;
    status: string;
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
    secretCode: { type: String, default: generateSecretCode },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
