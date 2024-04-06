import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Size from "@/models/size.model";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await Size.findOne({ _id: params.sizeId });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    // Verify the store exists and belongs to the user
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Delete the size and remove its reference from the store
    const size = await Size.findByIdAndDelete(params.sizeId);
    if (!size) {
      return new NextResponse("Size not found", { status: 404 });
    }

    // Ensure the size belongs to the store before attempting to pull it
    if (size.storeId.toString() !== params.storeId) {
      return new NextResponse("Size does not belong to the store", {
        status: 400,
      });
    }

    await Store.findByIdAndUpdate(params.storeId, {
      $pull: { sizes: size._id },
    });

    return NextResponse.json({ message: "Size deleted successfully" });
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    // Verify the store exists and belongs to the user
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Update the size
    const size = await Size.findByIdAndUpdate(
      params.sizeId,
      { name, value },
      { new: true, runValidators: true }
    );

    if (!size) {
      return new NextResponse("Size not found", { status: 404 });
    }

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
