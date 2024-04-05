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
