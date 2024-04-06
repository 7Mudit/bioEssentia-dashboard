import mongoose, { model, Schema, models, Document } from "mongoose";

interface ImageDocument extends Document {
  productId: Schema.Types.ObjectId;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create an index on productId for faster query execution
imageSchema.index({ productId: 1 });

const Image = models.Image || mongoose.model("Image", imageSchema);

export default Image;
