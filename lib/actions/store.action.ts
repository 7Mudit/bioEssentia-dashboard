"use server";

import Store from "@/models/store.model";
import { connectToDb } from "../mongoose";
import { auth } from "@clerk/nextjs";

interface createStoreParams {
  name: string;
}

export async function createStore(params: createStoreParams) {
  try {
    await connectToDb();
    const { userId } = auth();
    const { name } = params;

    if (!name) {
      throw new Error("Name not found");
    }
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const store = await Store.create({
      userId,
      name,
    });
    return store;
  } catch (err) {
    console.log("[STORES_POST]" + err);
    throw err;
  }
}

export async function getStores(userId: string) {
  try {
    if (!userId) {
      throw new Error("user id not present");
    }
    const stores = await Store.find({ userId: userId });
    console.log(stores);
    return JSON.stringify(stores);
  } catch (err) {
    console.log(err);
  }
}
