import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Flavour from "@/models/flavour.model";

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

    // Validate the store belongs to the user and exists
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized or store not found", {
        status: 404,
      });
    }

    // Create the flavour
    const flavour = await Flavour.create({
      name,
      value,
      storeId: params.storeId,
    });

    // Update the store to include this flavour
    store.flavours.push(flavour._id);
    await store.save();

    return NextResponse.json(flavour);
  } catch (error) {
    console.log("[FLAVOURS_POST]", error);
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
    const flavours = await Flavour.find({ storeId: params.storeId });

    return NextResponse.json(flavours);
  } catch (error) {
    console.log("[FLAVOURS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
