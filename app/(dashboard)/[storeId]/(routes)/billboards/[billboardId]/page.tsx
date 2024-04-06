import { connectToDb } from "@/lib/mongoose";
import { BillboardForm } from "./components/billboard-form";
import Billboard from "@/models/billboard.model";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  await connectToDb();
  let billboard;

  if (params.billboardId === "new") {
    billboard = null;
  } else {
    billboard = await Billboard.findOne({ _id: params.billboardId }).exec();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={JSON.parse(JSON.stringify(billboard))} />
      </div>
    </div>
  );
};

export default BillboardPage;
