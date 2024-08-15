import { models, model, Document, Schema } from "mongoose";

interface IProduct extends Document {
  storeId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  price: number;
  slug: string;
  fakePrice: number;
  content: Record<string, any>; // JSON type
  contentHTML: string;
  features: string[];
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: Schema.Types.ObjectId[];
  flavourId: Schema.Types.ObjectId[];
  images: Schema.Types.ObjectId[];
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
    slug: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed }, // JSON type
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    sizeId: [{ type: Schema.Types.ObjectId, ref: "Size", required: true }],
    contentHTML: { type: String }, // HTML content
    flavourId: [
      { type: Schema.Types.ObjectId, ref: "Flavour", required: true },
    ],
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ storeId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ sizeId: 1 });
productSchema.index({ colorId: 1 });
productSchema.index({ slug: 1 });

const Product = models.Product || model("Product", productSchema);

export default Product;
