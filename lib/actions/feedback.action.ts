"use server";

import { connectToDb } from "../mongoose";
import Feedback from "@/models/feedback.model";
import { Schema, Types } from "mongoose";
import Product from "@/models/product.model";

interface FeedbackData {
  userName: string;
  rating: number;
  feedback: string;
  productId: Types.ObjectId;
  approved?: boolean;
}

export async function createFeedback(data: FeedbackData) {
  try {
    await connectToDb();

    const newFeedback = new Feedback({
      userName: data.userName,
      rating: data.rating,
      feedback: data.feedback,
      productId: data.productId,
      approved: data.approved,
    });

    const savedFeedback = await newFeedback.save();

    await Product.findByIdAndUpdate(
      data.productId,
      { $push: { feedbacks: savedFeedback._id } },
      { new: true }
    );

    return JSON.stringify(savedFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error("Failed to create feedback");
  }
}

export async function fetchAllFeedback() {
  try {
    await connectToDb();
    const feedbackList = await Feedback.find().exec();
    return JSON.stringify(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw new Error("Failed to fetch feedback");
  }
}

export async function fetchFeedbackById(id: Schema.Types.ObjectId) {
  try {
    await connectToDb();
    const feedback = await Feedback.findById(id).exec();
    if (!feedback) {
      throw new Error("Feedback not found");
    }
    return feedback.toObject();
  } catch (error) {
    console.error(`Error fetching feedback with ID ${id}:`, error);
    throw new Error("Failed to fetch feedback");
  }
}

export async function deleteFeedbackById(id: Types.ObjectId) {
  try {
    await connectToDb();

    const objectId = id;

    await Product.updateOne(
      { feedbacks: objectId },
      { $pull: { feedbacks: objectId } }
    ).exec();

    const deletedFeedback = await Feedback.findByIdAndDelete(objectId).exec();
    if (!deletedFeedback) {
      throw new Error("Feedback not found for deletion");
    }

    return JSON.stringify(deletedFeedback);
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    throw new Error("Failed to delete feedback");
  }
}

export async function updateFeedbackById(
  id: Types.ObjectId,
  data: Partial<FeedbackData>
) {
  try {
    await connectToDb();
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (!updatedFeedback) {
      throw new Error("Feedback not found for update");
    }
    return JSON.stringify(updatedFeedback);
  } catch (error) {
    console.error(`Error updating feedback with ID ${id}:`, error);
    throw new Error("Failed to update feedback");
  }
}
