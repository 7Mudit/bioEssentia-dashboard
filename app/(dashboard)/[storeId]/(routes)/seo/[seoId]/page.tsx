import Seo from "@/models/seo.model";
import { SeoForm } from "./components/seo-form";

import { connectToDb } from "@/lib/mongoose";

const SeoPage = async ({
  params,
}: {
  params: { seoId: string; storeId: string };
}) => {
  await connectToDb();

  let seo;
  if (params.seoId === "new") {
    seo = null;
  } else {
    seo = await Seo.findById(params.seoId).exec();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SeoForm initialData={JSON.parse(JSON.stringify(seo))} />
      </div>
    </div>
  );
};

export default SeoPage;
