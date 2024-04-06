import mongoose, { models, model, Document, Schema } from "mongoose";

interface IOrder extends Document {
  storeId: Schema.Types.ObjectId;
  isPaid: boolean;
  phone: string;
  address: string;
}

const orderSchema: Schema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    isPaid: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;
