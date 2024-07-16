import { Schema, Document, model, models } from "mongoose";

interface IBlogPost extends Document {
  title: string;
  content: any; // JSON type
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }, // JSON type
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

blogPostSchema.index({ title: 1 });

const BlogPost = models.BlogPost || model("BlogPost", blogPostSchema);

export default BlogPost;
