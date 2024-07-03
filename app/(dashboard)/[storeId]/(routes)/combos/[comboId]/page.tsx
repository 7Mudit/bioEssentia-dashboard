import Category from "@/models/category.model";
import { connectToDb } from "@/lib/mongoose";
import Size from "@/models/size.model";
import Flavour from "@/models/flavour.model";
import Combo from "@/models/combo.model";
import { ComboForm } from "./components/combo-form";

const ComboPage = async ({
  params,
}: {
  params: { comboId: string; storeId: string };
}) => {
  await connectToDb();
  let combo;
  if (params.comboId === "new") {
    combo = null;
  } else {
    combo = await Combo.findOne({ _id: params.comboId }).populate("images");
  }

  const categories = await Category.find({ storeId: params.storeId });

  const sizes = await Size.find({ storeId: params.storeId });

  const flavours = await Flavour.find({ storeId: params.storeId });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ComboForm
          categories={JSON.parse(JSON.stringify(categories))}
          flavours={JSON.parse(JSON.stringify(flavours))}
          sizes={JSON.parse(JSON.stringify(sizes))}
          initialData={JSON.parse(JSON.stringify(combo))}
        />
      </div>
    </div>
  );
};

export default ComboPage;
