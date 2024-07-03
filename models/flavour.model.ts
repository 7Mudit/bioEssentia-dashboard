import { models, model, Document, Schema } from "mongoose";

interface IFlavour extends Document {
  storeId: Schema.Types.ObjectId;
  name: string;
  value: string;
  products?: Schema.Types.ObjectId[]; // Reference to Product documents
  combos?: Schema.Types.ObjectId[]; // Reference to Product documents
  createdAt: Date;
  updatedAt: Date;
}

const flavourSchema = new Schema<IFlavour>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Assuming a bidirectional relation, may need manual management
    combos: [{ type: Schema.Types.ObjectId, ref: "Combo" }], // Assuming a bidirectional relation, may need manual management
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create an index on storeId for faster query execution
flavourSchema.index({ storeId: 1 });

const Flavour = models.Flavour || model("Flavour", flavourSchema);

export default Flavour;
