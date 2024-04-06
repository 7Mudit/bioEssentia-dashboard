import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Size from "@/models/size.model";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Verify the store exists and belongs to the user
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Create the new Size document
    const newSize = new Size({
      storeId: params.storeId,
      name,
      value,
    });
    await newSize.save();
    // Update the store document to include the new size
    store.sizes.push(newSize._id);
    await store.save();

    return NextResponse.json(newSize);
  } catch (error) {
    console.log("[SIZES_POST]", error);
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

    const sizes = await Size.find({ storeId: params.storeId });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
