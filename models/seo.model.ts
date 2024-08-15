import mongoose, { models, model, Schema, Document } from "mongoose";

interface ISeoMetadata extends Document {
  storeId: mongoose.Types.ObjectId;
  url: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogUrl: string;
  slug: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  seoSchema: string;
  metaRobots: string;
  altTag: string;
  schemaReview: string;
  keywords: string;
  createdAt: Date;
  updatedAt: Date;
}

const seoMetadataSchema = new Schema<ISeoMetadata>(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    h1: { type: String, required: true },
    canonical: { type: String, required: true },
    ogUrl: { type: String, required: true },
    ogTitle: { type: String, required: true },
    ogDescription: { type: String, required: true },
    ogImage: { type: String, required: true },
    seoSchema: { type: String, required: false },
    metaRobots: { type: String, required: true },
    altTag: { type: String, required: true },
    schemaReview: { type: String, required: false },
    keywords: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const SeoMetadata =
  models.SeoMetadata || model("SeoMetadata", seoMetadataSchema);

export default SeoMetadata;
