import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Category from "@/models/category.model";
import Billboard from "@/models/billboard.model";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    // Validate that the store belongs to the user
    const store = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    // Validate the billboard belongs to the store
    const billboard = await Billboard.findOne({
      _id: billboardId,
      storeId: store._id,
    });
    if (!billboard) {
      return new NextResponse(
        "Billboard not found or doesn't belong to the store",
        { status: 404 }
      );
    }

    // Create and save the new category
    const category = new Category({
      name: name,
      billboardId: billboardId,
      storeId: params.storeId,
    });
    await category.save();

    // Add category ID to the Billboard and Store documents
    billboard.categories.push(category._id);
    await billboard.save();

    store.categories.push(category._id);
    await store.save();

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await Category.find({
      storeId: params.storeId,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
