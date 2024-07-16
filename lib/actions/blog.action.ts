"use server";

import BlogPost from "@/models/blog.model";
import Product from "@/models/product.model";
import { connectToDb } from "@/lib/mongoose";

export async function createBlogForProduct(productId: string, blogData: any) {
  console.log("called");
  try {
    await connectToDb();
    console.log("Creating new blog with data:", blogData);
    blogData = JSON.parse(blogData);

    const newBlog = await new BlogPost(blogData);
    await newBlog.save();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.blogs.push(newBlog._id);
    await product.save();

    return { success: true };
  } catch (error) {
    console.error("Error creating blog for product:", error);
    throw new Error("Failed to create blog");
  }
}

export async function updateBlogById(blogId: string, blogData: any) {
  try {
    await connectToDb();
    blogData = JSON.parse(blogData);
    console.log("Updating blog with ID:", blogId, "with data:", blogData);

    const updatedBlog = await BlogPost.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });
    if (!updatedBlog) {
      throw new Error("Blog not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
}

export async function deleteBlogById(blogId: string) {
  try {
    await connectToDb();
    console.log("Deleting blog with ID:", blogId);

    const deletedBlog = await BlogPost.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      throw new Error("Blog not found");
    }

    // Remove the blog reference from the associated product
    await Product.updateMany({ blogs: blogId }, { $pull: { blogs: blogId } });

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
}

export async function fetchProductBlogsById(productId: string) {
  try {
    await connectToDb();
    console.log("Fetching blogs for product ID:", productId);

    const product = await Product.findById(productId).populate("blogs").exec();
    if (!product) {
      throw new Error("Product not found");
    }
    return { success: true, product: product };
  } catch (error) {
    console.error("Error fetching product blogs by ID:", error);
    throw new Error("Failed to fetch product blogs");
  }
}

export async function fetchBlogById(blogId: string) {
  try {
    await connectToDb();
    console.log("Fetching blog with ID:", blogId);

    const blog = await BlogPost.findById(blogId).exec();
    if (!blog) {
      throw new Error("Blog not found");
    }
    return { success: true, blog: JSON.stringify(blog) };
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw new Error("Failed to fetch blog");
  }
}
