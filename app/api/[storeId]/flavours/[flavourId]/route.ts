import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Flavour from "@/models/flavour.model";
import Store from "@/models/store.model";

export async function GET(
  req: Request,
  { params }: { params: { flavourId: string } }
) {
  try {
    if (!params.flavourId) {
      return new NextResponse("Flavour id is required", { status: 400 });
    }

    const flavour = await Flavour.findById(params.flavourId);

    return NextResponse.json(flavour);
  } catch (error) {
    console.log("[FLAVOUR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { flavourId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.flavourId) {
      return new NextResponse("Flavour id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId,
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    // Delete the flavour
    const flavour = await Flavour.findByIdAndDelete(params.flavourId);
    if (!flavour) {
      return new NextResponse("Flavour not found", { status: 404 });
    }

    // Remove the flavour reference from the store's flavours array
    await Store.findByIdAndUpdate(params.storeId, {
      $pull: { flavours: flavour._id },
    });

    return NextResponse.json("Flavour deleted successfully");
  } catch (error) {
    console.log("[FLAVOUR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { flavourId: string; storeId: string } }
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

    if (!params.flavourId) {
      return new NextResponse("Flavour id is required", { status: 400 });
    }

    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const updatedFlavour = await Flavour.findByIdAndUpdate(
      params.flavourId,
      { name: name, value: value },
      { new: true }
    );

    return NextResponse.json(updatedFlavour);
  } catch (error) {
    console.log("[FLAVOUR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
