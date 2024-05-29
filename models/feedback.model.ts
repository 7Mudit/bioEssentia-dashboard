import { models, model, Document, Schema } from "mongoose";

interface IFeedback extends Document {
  userName: string;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt`
  }
);

const Feedback = models.Feedback || model("Feedback", feedbackSchema);

export default Feedback;
