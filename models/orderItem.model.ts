import mongoose, { models, Document, model, Schema } from "mongoose";

interface IOrderItem extends Document {
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
}

const orderItemSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
});

const OrderItem =
  models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;
