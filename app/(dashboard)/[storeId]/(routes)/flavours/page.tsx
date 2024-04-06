import { format } from "date-fns";

import { FlavourColumn } from "./components/columns";
import { FlavourClient } from "./components/client";
import Flavour from "@/models/flavour.model";
import { connectToDb } from "@/lib/mongoose";

const FlavoursPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const flavours = await Flavour.find({ storeId: params.storeId }).sort({
    createdAt: -1,
  });

  const formattedFlavours: FlavourColumn[] = flavours.map((item) => ({
    id: item._id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FlavourClient data={JSON.parse(JSON.stringify(formattedFlavours))} />
      </div>
    </div>
  );
};

export default FlavoursPage;
