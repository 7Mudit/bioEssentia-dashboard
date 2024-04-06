import { connectToDb } from "@/lib/mongoose";
import { SizeForm } from "./components/size-form";
import Size from "@/models/size.model";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  await connectToDb();
  let size;
  if (params.sizeId === "new") {
    size = null;
  } else {
    size = await Size.findOne({ _id: params.sizeId });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={JSON.parse(JSON.stringify(size))} />
      </div>
    </div>
  );
};

export default SizePage;
