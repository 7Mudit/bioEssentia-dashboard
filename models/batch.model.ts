import { Schema, model, models, Document } from "mongoose";

interface IBatch extends Document {
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    batchId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

const Batch = models.Batch || model<IBatch>("Batch", batchSchema);

export default Batch;
