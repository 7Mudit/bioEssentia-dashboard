import { models, model, Document, Schema } from "mongoose";

interface ISize extends Document {
  storeId: Schema.Types.ObjectId;
  name: string;
  value: string;
  products?: Schema.Types.ObjectId[]; // Reference to Product documents
  combos?: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema = new Schema<ISize>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Assuming a bidirectional relation, may need manual management
    combos: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Assuming a bidirectional relation, may need manual management
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

sizeSchema.index({ storeId: 1 }); // Add an index on `storeId` for improved query performance

const Size = models.Size || model("Size", sizeSchema);

export default Size;
