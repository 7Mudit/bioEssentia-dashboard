import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import Product from "@/models/product.model";
import Category from "@/models/category.model";
import Flavour from "@/models/flavour.model";
import Size from "@/models/size.model";
import Image from "@/models/image.model";
import Feedback from "@/models/feedback.model";
import slugify from "slugify";

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
      .populate("sizes.sizeId")
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

    const store = await Store.findOne({ _id: params.storeId, userId: userId });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await Product.findByIdAndDelete(params.productId);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

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
      product.sizes.map((size: any) =>
        Size.findByIdAndUpdate(size.sizeId, {
          $pull: { products: product._id },
        })
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
      content,
      features,
      categoryId,
      contentHTML,
      images,
      flavourId,
      sizes, // Handle sizes array with price and fakePrice
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

    if (!sizes || !sizes.length) {
      return new NextResponse(
        "At least one size with price and fakePrice is required",
        {
          status: 400,
        }
      );
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!flavourId || !flavourId.length) {
      return new NextResponse("At least one flavour id is required", {
        status: 400,
      });
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

    // Generate slug from product name if the name is changed
    let slug = currentProduct.slug;
    if (name !== currentProduct.name) {
      slug = slugify(name, { lower: true, strict: true });

      // Ensure the slug is unique
      const existingProduct = await Product.findOne({
        slug,
        _id: { $ne: params.productId },
      });
      if (existingProduct) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Parse the content JSON if provided
    const parsedContent = content
      ? JSON.parse(content)
      : currentProduct.content;

    // Update the product details
    await Product.findByIdAndUpdate(params.productId, {
      name,
      slug,
      content: parsedContent,
      contentHTML,
      features,
      categoryId,
      flavourId,
      sizes, // Update sizes array with both price and fakePrice
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

    const newSizeIds = sizes.map((size: any) => size.sizeId);
    if (currentProduct.sizes) {
      const sizesToRemove = currentProduct.sizes
        .map((s: any) => s.sizeId.toString())
        .filter((id: any) => !newSizeIds.includes(id));
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
