import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Billboard from "@/models/billboard.model";
import Store from "@/models/store.model";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await Billboard.findOne({
      _id: params.billboardId,
    }).exec();

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    }).exec();

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    // Remove the billboard's reference from the store's billboards array
    await Store.findByIdAndUpdate(
      params.storeId,
      { $pull: { billboards: params.billboardId } },
      { new: true }
    ).exec();

    const deletionResult = await Billboard.deleteOne({
      _id: params.billboardId,
      // Additional safety check: ensure the billboard belongs to the store
      storeId: params.storeId,
    }).exec();

    // Check if a billboard was actually deleted
    if (deletionResult.deletedCount === 0) {
      return new NextResponse("Billboard not found or already deleted", {
        status: 404,
      });
    }

    return NextResponse.json({ message: "Billboard deleted successfully" });
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    }).exec();

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const updatedBillboard = await Billboard.findOneAndUpdate(
      { _id: params.billboardId },
      { label: label, imageUrl: imageUrl },
      { new: true } // Option to return the document after update
    ).exec();

    return NextResponse.json(updatedBillboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
