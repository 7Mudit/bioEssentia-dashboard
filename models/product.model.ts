import mongoose, { models, model, Document, Schema } from "mongoose";

interface IProduct extends Document {
  storeId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  price: number; // Decimal fields are typically represented as numbers in Mongoose
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: Schema.Types.ObjectId;
  flavourId: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[]; // Assuming you have an Image model defined elsewhere
  orderItems: Schema.Types.ObjectId[]; // Assuming an OrderItem model
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
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    sizeId: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    flavourId: { type: Schema.Types.ObjectId, ref: "Flavour", required: true },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
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
