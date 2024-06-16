import { Schema, model, models, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Coupon = models.Coupon || model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
