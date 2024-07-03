import { format } from "date-fns";

import { formatter } from "@/lib/utils";

import { CombosClient } from "./components/client";
import { ComboColumn } from "./components/columns";
import Combo from "@/models/combo.model";

const CombosPage = async ({ params }: { params: { storeId: string } }) => {
  const combos = await Combo.find({ storeId: params.storeId })
    .populate("categoryId")
    .populate("sizeId")
    .populate("flavourId")
    .sort({ createdAt: -1 });

  const formattedCombos: ComboColumn[] = combos.map((item) => ({
    id: item._id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.categoryId.name,
    size: item.sizeId,
    flavour: item.flavourId,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CombosClient data={JSON.parse(JSON.stringify(formattedCombos))} />
      </div>
    </div>
  );
};

export default CombosPage;
