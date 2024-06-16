"use server";
import Coupon from "@/models/coupon.model";
import { connectToDb } from "../mongoose";

export async function createCoupon(
  code: string,
  discountPercentage: number,
  expiryDate: Date
) {
  try {
    await connectToDb();
    const newCoupon = new Coupon({ code, discountPercentage, expiryDate });
    await newCoupon.save();
    return JSON.stringify(newCoupon);
  } catch (err) {
    console.error("Failed to create coupon:", err);
    throw new Error("Failed to create coupon");
  }
}

export async function fetchCoupons() {
  try {
    await connectToDb();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return JSON.stringify(coupons);
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    throw new Error("Failed to fetch coupons");
  }
}

export async function updateCoupon(
  id: string,
  code: string,
  discountPercentage: number,
  expiryDate: Date,
  isActive: boolean
) {
  try {
    await connectToDb();
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountPercentage, expiryDate, isActive },
      { new: true }
    );
    return JSON.stringify(updatedCoupon);
  } catch (err) {
    console.error("Failed to update coupon:", err);
    throw new Error("Failed to update coupon");
  }
}

export async function deleteCoupon(id: string) {
  try {
    await connectToDb();
    await Coupon.findByIdAndDelete(id);
    return { message: "Coupon deleted successfully" };
  } catch (err) {
    console.error("Failed to delete coupon:", err);
    throw new Error("Failed to delete coupon");
  }
}
