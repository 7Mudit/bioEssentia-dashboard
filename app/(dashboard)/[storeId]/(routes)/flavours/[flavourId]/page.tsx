import { connectToDb } from "@/lib/mongoose";
import { FlavourForm } from "./components/flavour-form";
import Flavour from "@/models/flavour.model";

const FlavourPage = async ({ params }: { params: { flavourId: string } }) => {
  await connectToDb();
  let flavour;
  if (params.flavourId === "new") {
    flavour = null;
  } else {
    flavour = await Flavour.findOne({ _id: params.flavourId });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FlavourForm initialData={JSON.parse(JSON.stringify(flavour))} />
      </div>
    </div>
  );
};

export default FlavourPage;
