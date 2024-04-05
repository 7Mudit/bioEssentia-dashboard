import { connectToDb } from "@/lib/mongoose";
import Store from "@/models/store.model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDb();
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Create a new store document and save it to MongoDB
    const store = await Store.create({
      userId,
      name,
    });

    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORES_POST]" + err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
