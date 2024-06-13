"use server";
import { connectToDb } from "../mongoose";
import Batch from "@/models/batch.model";

// Create a new batch
export async function createBatch(batchId: string) {
  try {
    await connectToDb();
    const newBatch = new Batch({ batchId });
    await newBatch.save();
    return JSON.stringify(newBatch);
  } catch (err) {
    console.error("Failed to create batch:", err);
    throw new Error("Failed to create batch");
  }
}

// Fetch all batches
export async function fetchBatches() {
  try {
    await connectToDb();
    const batches = await Batch.find().sort({ createdAt: -1 });
    return JSON.stringify(batches);
  } catch (err) {
    console.error("Failed to fetch batches:", err);
    throw new Error("Failed to fetch batches");
  }
}

// Update a batch by ID
export async function updateBatch(id: string, batchId: string) {
  try {
    await connectToDb();
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { batchId },
      { new: true }
    );
    return JSON.stringify(updatedBatch);
  } catch (err) {
    console.error("Failed to update batch:", err);
    throw new Error("Failed to update batch");
  }
}

// Delete a batch by ID
export async function deleteBatch(id: string) {
  try {
    await connectToDb();
    await Batch.findByIdAndDelete(id);
    return JSON.stringify({ message: "Batch deleted successfully" });
  } catch (err) {
    console.error("Failed to delete batch:", err);
    throw new Error("Failed to delete batch");
  }
}
