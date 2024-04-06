import { Schema, Document, model, models } from "mongoose";

interface IBillboard extends Document {
  storeId: string;
  label: string;
  imageUrl: string;
  categories: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const billboardSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    label: { type: String, required: true },
    imageUrl: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const Billboard = models.Billboard || model("Billboard", billboardSchema);

export default Billboard;
