import { Product } from "@/models";

export const getStockCount = async (storeId: string) => {
  const stockCount = await Product.countDocuments({
    storeId: storeId,
    isArchived: false,
  });

  return stockCount;
};
