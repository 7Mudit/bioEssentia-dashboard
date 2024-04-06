import Product from "@/models/product.model";
import { ProductForm } from "./components/product-form";
import Category from "@/models/category.model";
import { connectToDb } from "@/lib/mongoose";
import Size from "@/models/size.model";
import Flavour from "@/models/flavour.model";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  await connectToDb();
  let product;
  if (params.productId === "new") {
    product = null;
  } else {
    product = await Product.findOne({ _id: params.productId }).populate(
      "images"
    );
  }

  const categories = await Category.find({ storeId: params.storeId });

  const sizes = await Size.find({ storeId: params.storeId });

  const flavours = await Flavour.find({ storeId: params.storeId });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={JSON.parse(JSON.stringify(categories))}
          flavours={JSON.parse(JSON.stringify(flavours))}
          sizes={JSON.parse(JSON.stringify(sizes))}
          initialData={JSON.parse(JSON.stringify(product))}
        />
      </div>
    </div>
  );
};

export default ProductPage;
