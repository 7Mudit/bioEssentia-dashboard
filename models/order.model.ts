import { Schema, model, models, Document, Types } from "mongoose";

export interface IProduct extends Document {
  productId: Types.ObjectId;
  quantity: number;
  flavor: string;
  size: string;
}

export interface IOrder extends Document {
  clerkId: string;
  products: IProduct[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Failed";
  createdAt: Date;
  updatedAt: Date;
  merchantTransactionId: string;
  coupon?: Types.ObjectId; // Optional coupon reference
}

const productSchema = new Schema<IProduct>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  flavor: { type: String, required: true },
  size: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    clerkId: { type: String, ref: "User", required: true },
    products: [productSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    merchantTransactionId: { type: String, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" }, // Optional coupon reference
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt`
  }
);

const Order = models.Order || model<IOrder>("Order", orderSchema);

export default Order;
