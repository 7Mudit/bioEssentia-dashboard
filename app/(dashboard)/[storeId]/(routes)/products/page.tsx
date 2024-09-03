import { format } from "date-fns";

import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import Product from "@/models/product.model";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await Product.find({ storeId: params.storeId })
    .populate("categoryId")
    .populate("sizes.sizeId")
    .populate("flavourId")
    .sort({ createdAt: -1 });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
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
        <ProductsClient data={JSON.parse(JSON.stringify(formattedProducts))} />
      </div>
    </div>
  );
};

export default ProductsPage;
