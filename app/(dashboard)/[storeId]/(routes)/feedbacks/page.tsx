import { format } from "date-fns";

import { ProductColumn } from "./components/column";
import { ProductClient } from "./components/client";

import { fetchAllProducts } from "@/lib/actions/product.action";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
 
  const productList = await fetchAllProducts();

  const formattedProducts: ProductColumn[] = productList.map((item) => ({
    id: item._id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={JSON.parse(JSON.stringify(formattedProducts))} />
      </div>
    </div>
  );
};

export default SizesPage;
