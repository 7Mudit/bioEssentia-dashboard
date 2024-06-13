"use server";
import { connectToDb } from "../mongoose";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import Image from "@/models/image.model";
import Address from "@/models/address.model";
import User from "@/models/user.model";

export async function fetchOrderById(orderId: string) {
  try {
    await connectToDb();

    const order = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        model: Product,
        populate: { path: "images", model: Image },
      })
      .exec();

    if (!order) return null;

    const user = await User.findOne({ clerkId: order.clerkId }).exec();
    const address = await Address.findOne({ clerkId: order.clerkId }).exec();

    return order ? JSON.stringify({ order, user, address }) : null;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    throw new Error("Failed to fetch order");
  }
}
