import mongoose, { Document, Schema } from "mongoose";

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
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  photos: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  sizes: {
    type: [String],
    default: ["XS", "S", "M", "L", "XL", "2XL"],
    required: false,
  }, // Add sizes array
  colors: { type: [String], required: false }, // Add colors array
});

const Merch = mongoose.model<IMerch>("Merch", merchSchema);

export default Merch;
