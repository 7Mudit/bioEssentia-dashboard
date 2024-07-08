import { models, model, Document, Schema } from "mongoose";

interface IFeedback extends Document {
  userName: string;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
  approved: boolean; // Adding the approved field
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Adding the approved field with a default value of false
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt`
  }
);

const Feedback = models.Feedback || model("Feedback", feedbackSchema);

export default Feedback;
