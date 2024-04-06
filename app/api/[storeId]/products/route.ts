import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Product from "@/models/product.model";
import Store from "@/models/store.model";
import Image from "@/models/image.model";
import Category from "@/models/category.model";
import Flavour from "@/models/flavour.model";
import Size from "@/models/size.model";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      flavourId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Verify store ownership
    const storeByUserId = await Store.findOne({
      _id: params.storeId,
      userId: userId,
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Create the product
    const product = await Product.create({
      name,
      price,
      isFeatured,
      isArchived,
      categoryId,
      flavourId,
      sizeId,
      storeId: params.storeId,
      //   images: images.map((img: any) => img.url),
    });
    // Step 2: Create image documents with productId
    const imageDocs = await Promise.all(
      images.map((img: any) =>
        Image.create({
          url: img.url,
          productId: product._id, // Set productId for each image
        })
      )
    );
    // Step 3: Update the product with image IDs
    await Product.findByIdAndUpdate(product._id, {
      $push: { images: { $each: imageDocs.map((doc) => doc._id) } },
    });

    // Push product ID to Store, Category, Flavours, and Sizes
    await Store.findByIdAndUpdate(params.storeId, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(categoryId, {
      $push: { products: product._id },
    });
    await Promise.all(
      flavourId.map((flavour: any) =>
        Flavour.findByIdAndUpdate(flavour, { $push: { products: product._id } })
      )
    );
    await Promise.all(
      sizeId.map((size: any) =>
        Size.findByIdAndUpdate(size, { $push: { products: product._id } })
      )
    );
    // Optionally, refetch the product to include the updated images
    const updatedProduct = await Product.findById(product._id).populate(
      "images"
    );
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const flavourId = searchParams.get("flavourId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    let query = {
      storeId: params.storeId,
      ...(categoryId && { categoryId: categoryId }),
      ...(flavourId && { colorId: flavourId }),
      ...(sizeId && { sizeId: sizeId }),
      ...(isFeatured !== undefined && { isFeatured: isFeatured }),
      isArchived: false,
    };

    const products = await Product.find(query)
      .populate("images")
      .populate("categoryId")
      .populate("flavorId")
      .populate("sizeId")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
