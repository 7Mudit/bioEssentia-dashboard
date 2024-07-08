"use server";

import { connectToDb } from "../mongoose";
import Product from "@/models/product.model";

export async function fetchAllProducts() {
  try {
    await connectToDb();
    const productList = await Product.find({
      storeId: "66585955a3fe976423095792",
    }).exec();

    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function fetchProductById(id: string) {
  try {
    await connectToDb();

    const product = await Product.findById(id).populate("feedbacks").exec();

    if (!product) {
      throw new Error("Product not found");
    }

    const productJson = product.toObject();

    return productJson;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product");
  }
}
