import { models, model, Document, Schema } from "mongoose";

interface IProduct extends Document {
  storeId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  price: number;
  fakePrice: number;
  description: string;
  features: string[];
  suggestedUse: string;
  benefits: string;
  nutritionalUse: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: Schema.Types.ObjectId[];
  flavourId: Schema.Types.ObjectId[];
  images: Schema.Types.ObjectId[];
  orderItems: Schema.Types.ObjectId[];
  feedbacks: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    fakePrice: { type: Number },
    description: { type: String, required: true },
    features: [{ type: String }],
    suggestedUse: { type: String },
    benefits: { type: String },
    nutritionalUse: { type: String },
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    sizeId: [{ type: Schema.Types.ObjectId, ref: "Size", required: true }],
    flavourId: [
      { type: Schema.Types.ObjectId, ref: "Flavour", required: true },
    ],
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt`
  }
);

productSchema.index({ storeId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ sizeId: 1 });
productSchema.index({ colorId: 1 });

const Product = models.Product || model("Product", productSchema);

export default Product;
