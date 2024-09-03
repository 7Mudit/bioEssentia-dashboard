import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  password?: string;
  picture: string;
  joinedAt: Date;
  cart: {
    product: Schema.Types.ObjectId;
    quantity: number;
    flavor: string;
    size: string;
    price: number;
  }[];
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  picture: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      flavor: String,
      size: String,
      price: Number,
    },
  ],
});

UserSchema.index({ clerkId: 1 });

const User = models.User || model("User", UserSchema);

export default User;
