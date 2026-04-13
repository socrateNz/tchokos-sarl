import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  sizes: string[];
  category: "homme" | "femme" | "enfant" | "accessoires";


  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    sizes: [{ type: String }],
    category: {
      type: String,
      enum: ["homme", "femme", "enfant", "accessoires"],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },

  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1 });


const Product =
  (models.Product as mongoose.Model<IProduct>) ||
  model<IProduct>("Product", ProductSchema);

export default Product;
