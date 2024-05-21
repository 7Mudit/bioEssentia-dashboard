import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Category from "@/models/category.model";
import Store from "@/models/store.model";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await Category.findById(params.categoryId);

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // Check if the store exists and belongs to the user
    const store = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    });

    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const categoryToDelete = await Category.findOne({ _id: params.categoryId });
    if (!categoryToDelete) {
      return new NextResponse("Category not found", { status: 404 });
    }

    // Delete the category
    await Category.findByIdAndDelete(params.categoryId);
    // Remove the category ID from the Store document
    await Store.updateOne(
      { _id: params.storeId },
      { $pull: { categories: categoryToDelete._id } }
    );

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    // Find the existing category to update and verify it belongs to the store
    const existingCategory = await Category.findById(params.categoryId);
    if (
      !existingCategory ||
      existingCategory.storeId.toString() !== params.storeId
    ) {
      return new NextResponse(
        "Category not found or does not belong to the store",
        { status: 404 }
      );
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      params.categoryId,
      { name: name },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
