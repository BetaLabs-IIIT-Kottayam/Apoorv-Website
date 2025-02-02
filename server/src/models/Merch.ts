import mongoose, { Document, Schema } from 'mongoose';

interface IPhoto {
    data: Buffer;
    contentType: string;
}

interface IMerch extends Document {
    name: string;
    description: string;
    price: number;
    photos: IPhoto[];
    // size: 'S' | 'M' | 'L';
    // stock: number;
}

const merchSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photos: [{
        data: Buffer,
        contentType: String
    }],
    // size: { type: String, enum: ['S', 'M', 'L'], required: true },
    // stock: { type: Number, required: true },
});

const Merch = mongoose.model<IMerch>('Merch', merchSchema);

export default Merch;
