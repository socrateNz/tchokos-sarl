import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IStock extends Document {
  productId: mongoose.Types.ObjectId;
  size: string;
  quantity: number;
  price: number;
}


const StockSchema = new Schema<IStock>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },

  { timestamps: true }
);

// Compound index to quickly find stock for a specific product size
StockSchema.index({ productId: 1, size: 1 }, { unique: true });

// Clear the model if it exists to ensure schema updates are applied in development
if (mongoose.models.Stock) {
  delete mongoose.models.Stock;
}

const Stock = model<IStock>("Stock", StockSchema);

export default Stock;

