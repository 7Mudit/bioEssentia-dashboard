import { Schema, model, models, Document } from "mongoose";

export interface IAddress extends Document {
  clerkId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
}

const AddressSchema = new Schema<IAddress>({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Address = models.Address || model("Address", AddressSchema);

export default Address;
