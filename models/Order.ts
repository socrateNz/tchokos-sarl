import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  size: string;
  price: number;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered";
  source: "whatsapp" | "direct";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending",
    },
    source: {
      type: String,
      enum: ["whatsapp", "direct"],
      default: "whatsapp",
    },
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1, createdAt: -1 });

const Order =
  (models.Order as mongoose.Model<IOrder>) ||
  model<IOrder>("Order", OrderSchema);

export default Order;
