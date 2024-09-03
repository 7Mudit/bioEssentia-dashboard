import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Product from "@/models/product.model";
import Store from "@/models/store.model";
import Image from "@/models/image.model";
import Category from "@/models/category.model";
import Flavour from "@/models/flavour.model";
import Size from "@/models/size.model";
import { connectToDb } from "@/lib/mongoose";
import slugify from "slugify";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      fakePrice,
      contentHTML,
      content,
      features,
      categoryId,
      flavourId,
      sizes,
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

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!flavourId) {
      return new NextResponse("Flavour id is required", { status: 400 });
    }

    if (!sizes || !sizes.length) {
      return new NextResponse("At least one size with price is required", {
        status: 400,
      });
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

    // Generate slug from product name
    let slug = slugify(name, { lower: true, strict: true });
    // Ensure the slug is unique
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    // Parse the content JSON
    const parsedContent = JSON.parse(content);

    // Create the product
    const product = await Product.create({
      name,
      slug,
      fakePrice,
      content: parsedContent,
      contentHTML,
      features,
      isFeatured,
      isArchived,
      categoryId,
      flavourId,
      sizes,
      storeId: params.storeId,
    });
    // Create image documents with productId
    const imageDocs = await Promise.all(
      images.map((img: any) =>
        Image.create({
          url: img.url,
          productId: product._id,
        })
      )
    );

    // Update the product with image IDs
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
      sizes.map((size: any) =>
        Size.findByIdAndUpdate(size.sizeId, {
          $push: { products: product._id },
        })
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
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const flavourId = searchParams.get("flavourId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const query: any = { storeId: params.storeId, isArchived: false };

    if (categoryId) query.categoryId = categoryId;
    if (flavourId) query.flavourId = flavourId;
    if (sizeId) {
      query["sizes.sizeId"] = sizeId;
    }
    if (isFeatured !== null && isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    const products = await Product.find(query)
      .populate("images")
      .populate("categoryId")
      .populate("flavourId")
      .populate("sizes.sizeId")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
