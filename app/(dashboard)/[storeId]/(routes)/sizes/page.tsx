import { format } from "date-fns";

import { SizeColumn } from "./components/columns";
import { SizesClient } from "./components/client";
import Size from "@/models/size.model";
import { connectToDb } from "@/lib/mongoose";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const sizes = await Size.find({ storeId: params.storeId }).sort({
    createdAt: -1,
  }); // -1 for descending order

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item._id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={JSON.parse(JSON.stringify(formattedSizes))} />
      </div>
    </div>
  );
};

export default SizesPage;
