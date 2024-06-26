import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Product from "@/models/product.model";
import Category from "@/models/category.model";
import Flavour from "@/models/flavour.model";
import Size from "@/models/size.model";
import Image from "@/models/image.model";
import Feedback from "@/models/feedback.model";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    const product = await Product.findById(params.productId)
      .populate("images")
      .populate("categoryId")
      .populate("sizeId")
      .populate("flavourId")
      .populate("feedbacks");

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // Verify store ownership
    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Attempt to delete the product
    const product = await Product.findByIdAndDelete(params.productId);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }
    // Remove the product ID from related Category, Flavour, Size documents
    await Category.findByIdAndUpdate(product.categoryId, {
      $pull: { products: product._id },
    });
    await Promise.all(
      product.flavourId.map((flavour: any) =>
        Flavour.findByIdAndUpdate(flavour, {
          $pull: { products: product._id },
        })
      )
    );
    await Promise.all(
      product.sizeId.map((size: any) =>
        Size.findByIdAndUpdate(size, { $pull: { products: product._id } })
      )
    );
    await Store.findByIdAndUpdate(params.storeId, {
      $pull: { products: product._id },
    });

    await Image.deleteMany({ productId: product._id });
    await Feedback.deleteMany({ _id: { $in: product.feedbacks } });

    return NextResponse.json("Product successfully deleted");
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
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

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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
    // Fetch the current product document
    const currentProduct = await Product.findById(params.productId);

    if (!currentProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }
    // Update the product details
    await Product.findByIdAndUpdate(params.productId, {
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
      // Don't update images here; we'll handle them separately
    });

    // If categoryId has changed, update the old and new category documents
    if (categoryId.toString() !== currentProduct.categoryId.toString()) {
      // Remove product ID from the old category
      await Category.findByIdAndUpdate(currentProduct.categoryId, {
        $pull: { products: params.productId },
      });
      // Add product ID to the new category
      await Category.findByIdAndUpdate(categoryId, {
        $addToSet: { products: params.productId },
      });
    }

    const newSizeIds = sizeId; // Assuming this is now an array of size IDs
    if (currentProduct.sizeId) {
      const sizesToRemove = currentProduct.sizeId.filter(
        (id: any) => !newSizeIds.includes(id.toString())
      );
      await Promise.all(
        sizesToRemove.map((sizeId: any) =>
          Size.findByIdAndUpdate(sizeId, {
            $pull: { products: params.productId },
          })
        )
      );
    }
    // Add product ID to new sizes
    await Promise.all(
      newSizeIds.map((sizeId: any) =>
        Size.findByIdAndUpdate(
          sizeId,
          { $addToSet: { products: params.productId } },
          { new: true }
        )
      )
    );

    const newFlavourIds = flavourId;
    if (currentProduct.flavourId) {
      const flavoursToRemove = currentProduct.flavourId.filter(
        (id: any) => !newFlavourIds.includes(id.toString())
      );
      await Promise.all(
        flavoursToRemove.map((flavourId: any) =>
          Flavour.findByIdAndUpdate(flavourId, {
            $pull: { products: params.productId },
          })
        )
      );
    }
    await Promise.all(
      newFlavourIds.map((flavourId: any) =>
        Flavour.findByIdAndUpdate(
          flavourId,
          { $addToSet: { products: params.productId } },
          { new: true }
        )
      )
    );

    // First, delete existing images associated with the product
    await Image.deleteMany({ productId: params.productId });
    // Then, create new image documents for the updated images
    const imageDocs = await Promise.all(
      images.map((img: any) =>
        Image.create({ url: img.url, productId: params.productId })
      )
    );

    // update the Product with the new image IDs
    await Product.findByIdAndUpdate(params.productId, {
      $set: { images: imageDocs.map((doc) => doc._id) },
    });

    // Fetch the updated product to include the updated images
    const updatedProduct = await Product.findById(params.productId).populate(
      "images"
    );
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
