import { models, model, Document, Schema } from "mongoose";

interface ISizePricing {
  sizeId: Schema.Types.ObjectId;
  price: number;
}

interface IProduct extends Document {
  storeId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  slug: string;
  fakePrice: number;
  content: Record<string, any>;
  contentHTML: string;
  features: string[];
  isFeatured: boolean;
  isArchived: boolean;
  sizes: ISizePricing[];
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
    fakePrice: { type: Number },
    slug: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed },
    contentHTML: { type: String },
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    sizes: [
      {
        sizeId: { type: Schema.Types.ObjectId, ref: "Size", required: true },
        price: { type: Number, required: true, default: 0 },
      },
    ],
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
productSchema.index({ slug: 1 });
productSchema.index({ "sizes.sizeId": 1 });

const Product = models.Product || model("Product", productSchema);

export default Product;
