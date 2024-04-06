import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Billboard from "@/models/billboard.model";
import { revalidatePath } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    }).exec();

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const billboard = await Billboard.create({
      label: label,
      imageUrl: imageUrl,
      storeId: params.storeId,
    });
    // Push the new billboard's ID into the store's billboards array
    await Store.findByIdAndUpdate(
      params.storeId,
      { $push: { billboards: billboard._id } },
      { new: true }
    ).exec();

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await Billboard.find({ storeId: params.storeId }).exec();

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
