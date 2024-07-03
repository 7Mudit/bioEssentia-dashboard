import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Category from "@/models/category.model";
import Flavour from "@/models/flavour.model";
import Size from "@/models/size.model";
import Image from "@/models/image.model";
import Feedback from "@/models/feedback.model";
import Combo from "@/models/combo.model";

export async function GET(
  req: Request,
  { params }: { params: { comboId: string } }
) {
  try {
    if (!params.comboId) {
      return new NextResponse("Combo id is required", { status: 400 });
    }
    const combo = await Combo.findById(params.comboId)
      .populate("images")
      .populate("categoryId")
      .populate("sizeId")
      .populate("flavourId")
      .populate("feedbacks");

    return NextResponse.json(combo);
  } catch (error) {
    console.log("[COMBO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { comboId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.comboId) {
      return new NextResponse("Combo id is required", { status: 400 });
    }

    // Verify store ownership
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Attempt to delete the combo
    const combo = await Combo.findByIdAndDelete(params.comboId);
    if (!combo) {
      return new NextResponse("Combo not found", { status: 404 });
    }
    // Remove the combo ID from related Category, Flavour, Size documents
    await Category.findByIdAndUpdate(combo.categoryId, {
      $pull: { combos: combo._id },
    });
    await Promise.all(
      combo.flavourId.map((flavour: any) =>
        Flavour.findByIdAndUpdate(flavour, {
          $pull: { combos: combo._id },
        })
      )
    );
    await Promise.all(
      combo.sizeId.map((size: any) =>
        Size.findByIdAndUpdate(size, { $pull: { combos: combo._id } })
      )
    );
    await Store.findByIdAndUpdate(params.storeId, {
      $pull: { combos: combo._id },
    });

    await Image.deleteMany({ comboId: combo._id });
    await Feedback.deleteMany({ _id: { $in: combo.feedbacks } });

    return NextResponse.json("Combo successfully deleted");
  } catch (error) {
    console.log("[COMBO_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { comboId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      fakePrice,
      description,
      features,
      suggestedUse,
      benefits,
      nutritionalUse,
      categoryId,
      images,
      flavourId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.comboId) {
      return new NextResponse("Combo id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!flavourId) {
      return new NextResponse("Flavour id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const currentCombo = await Combo.findById(params.comboId);

    if (!currentCombo) {
      return new NextResponse("Combo not found", { status: 404 });
    }

    await Combo.findByIdAndUpdate(params.comboId, {
      name,
      price,
      fakePrice,
      description,
      features,
      suggestedUse,
      benefits,
      nutritionalUse,
      categoryId,
      flavourId,
      sizeId,
      isFeatured,
      isArchived,
    });

    if (categoryId.toString() !== currentCombo.categoryId.toString()) {
      await Category.findByIdAndUpdate(currentCombo.categoryId, {
        $pull: { combos: params.comboId },
      });
      await Category.findByIdAndUpdate(categoryId, {
        $addToSet: { combos: params.comboId },
      });
    }

    const newSizeIds = sizeId;
    if (currentCombo.sizeId) {
      const sizesToRemove = currentCombo.sizeId.filter(
        (id: any) => !newSizeIds.includes(id.toString())
      );
      await Promise.all(
        sizesToRemove.map((sizeId: any) =>
          Size.findByIdAndUpdate(sizeId, {
            $pull: { combos: params.comboId },
          })
        )
      );
    }

    await Promise.all(
      newSizeIds.map((sizeId: any) =>
        Size.findByIdAndUpdate(
          sizeId,
          { $addToSet: { combos: params.comboId } },
          { new: true }
        )
      )
    );

    const newFlavourIds = flavourId;
    if (currentCombo.flavourId) {
      const flavoursToRemove = currentCombo.flavourId.filter(
        (id: any) => !newFlavourIds.includes(id.toString())
      );
      await Promise.all(
        flavoursToRemove.map((flavourId: any) =>
          Flavour.findByIdAndUpdate(flavourId, {
            $pull: { combos: params.comboId },
          })
        )
      );
    }

    await Promise.all(
      newFlavourIds.map((flavourId: any) =>
        Flavour.findByIdAndUpdate(
          flavourId,
          { $addToSet: { combos: params.comboId } },
          { new: true }
        )
      )
    );

    await Image.deleteMany({ comboId: params.comboId });

    const imageDocs = await Promise.all(
      images.map((img: any) =>
        Image.create({ url: img.url, comboId: params.comboId })
      )
    );

    await Combo.findByIdAndUpdate(params.comboId, {
      $set: { images: imageDocs.map((doc) => doc._id) },
    });

    const updatedCombo = await Combo.findById(params.comboId).populate(
      "images"
    );

    return NextResponse.json(updatedCombo);
  } catch (error) {
    console.log("[COMBO_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
