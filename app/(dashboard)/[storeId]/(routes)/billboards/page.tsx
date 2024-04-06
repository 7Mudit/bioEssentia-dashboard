import { format } from "date-fns";

import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/client";
import Billboard from "@/models/billboard.model";
import { connectToDb } from "@/lib/mongoose";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const billboards = await Billboard.find({ storeId: params.storeId })
    .sort({ createdAt: -1 }) // Sorting by `createdAt` in descending order
    .exec(); // `.exec()` returns a true Promise, useful for error handling and async/await

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (item: any) => ({
      id: item._id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient
          data={JSON.parse(JSON.stringify(formattedBillboards))}
        />
      </div>
    </div>
  );
};

export default BillboardsPage;
