"use server";

import Store from "@/models/store.model";
import { connectToDb } from "../mongoose";
import { StoreModal } from "@/components/modals/store-modal";

interface createStoreParams {
  name: string;
}

export async function createStore(params: createStoreParams) {
  try {
    await connectToDb();
    const { name } = params;

    if (!name) {
      throw new Error("Name not found");
    }
    const store = await Store.create({});
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
