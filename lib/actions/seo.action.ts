"use server";

import { connectToDb } from "../mongoose";
import SeoMetadata from "@/models/seo.model";
import mongoose, { Schema, Types } from "mongoose";

interface SeoMetadataData {
  storeId: string;
  url: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  seoSchema: string;
  metaRobots: string;
  altTag: string;
  schemaReview: string;
  keywords: string;
}

export async function createSeoMetadata(data: SeoMetadataData) {
  try {
    await connectToDb();

    const newSeoMetadata = new SeoMetadata({
      ...data,
    });

    const savedSeoMetadata = await newSeoMetadata.save();

    return { success: true };
  } catch (error) {
    console.error("Error creating SEO metadata:", error);
    throw new Error("Failed to create SEO metadata");
  }
}

export async function fetchAllSeoMetadata() {
  try {
    await connectToDb();
    const seoMetadataList = await SeoMetadata.find().exec();
    return seoMetadataList;
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
    throw new Error("Failed to fetch SEO metadata");
  }
}

export async function fetchSeoMetadataById(id: Schema.Types.ObjectId) {
  try {
    await connectToDb();
    const seoMetadata = await SeoMetadata.findById(id).exec();
    if (!seoMetadata) {
      throw new Error("SEO metadata not found");
    }
    return JSON.stringify(seoMetadata);
  } catch (error) {
    console.error(`Error fetching SEO metadata with ID ${id}:`, error);
    throw new Error("Failed to fetch SEO metadata");
  }
}

export async function deleteSeoMetadataById(id: Types.ObjectId) {
  try {
    await connectToDb();

    const objectId = id;

    const deletedSeoMetadata = await SeoMetadata.findByIdAndDelete(
      objectId
    ).exec();
    if (!deletedSeoMetadata) {
      throw new Error("SEO metadata not found for deletion");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting SEO metadata with ID ${id}:`, error);
    throw new Error("Failed to delete SEO metadata");
  }
}

export async function updateSeoMetadataById(
  id: Types.ObjectId,
  data: Partial<SeoMetadataData>
) {
  try {
    await connectToDb();
    const updatedSeoMetadata = await SeoMetadata.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (!updatedSeoMetadata) {
      throw new Error("SEO metadata not found for update");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error updating SEO metadata with ID ${id}:`, error);
    throw new Error("Failed to update SEO metadata");
  }
}
