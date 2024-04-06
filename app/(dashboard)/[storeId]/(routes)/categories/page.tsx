import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";
import { connectToDb } from "@/lib/mongoose";
import Category from "@/models/category.model";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const categories = await Category.find({ storeId: params.storeId })
    .populate("billboardId")
    .sort({ createdAt: -1 })
    .exec();

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item._id,
    name: item.name,
    billboardLabel: item.billboardId.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient
          data={JSON.parse(JSON.stringify(formattedCategories))}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
