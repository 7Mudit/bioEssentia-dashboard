import Category from "@/models/category.model";
import { CategoryForm } from "./components/category-form";

import { connectToDb } from "@/lib/mongoose";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  await connectToDb();
  let category;
  if (params.categoryId === "new") {
    category = null;
  } else {
    category = await Category.findOne({ _id: params.categoryId }).exec();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={JSON.parse(JSON.stringify(category))} />
      </div>
    </div>
  );
};

export default CategoryPage;
