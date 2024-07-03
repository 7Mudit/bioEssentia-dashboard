import { Schema, Document, model, models } from "mongoose";

interface IStore extends Document {
  name: string;
  userId: string;
  // Assuming relations are referenced by ID and you'll populate them as needed
  billboards: Schema.Types.ObjectId[];
  categories: Schema.Types.ObjectId[];
  products: Schema.Types.ObjectId[];
  sizes: Schema.Types.ObjectId[];
  flavours: Schema.Types.ObjectId[];
  orders: Schema.Types.ObjectId[];
  combos: Schema.Types.ObjectId[]; // Add this line for combos reference
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  billboards: [{ type: Schema.Types.ObjectId, ref: "Billboard" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  sizes: [{ type: Schema.Types.ObjectId, ref: "Size" }],
  flavours: [{ type: Schema.Types.ObjectId, ref: "Flavour" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  combos: [{ type: Schema.Types.ObjectId, ref: "Combo" }],
});

const Store = models.Store || model("Store", storeSchema);

export default Store;
