import { format } from "date-fns";

import { SeoColumn } from "./components/columns";
import { SeoClient } from "./components/client";
import { connectToDb } from "@/lib/mongoose";
import Seo from "@/models/seo.model";

const SeoPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const requiredseo = await Seo.find({ storeId: (params.storeId) })
    .sort({ createdAt: -1 })
    .exec();



  const formattedSeo: SeoColumn[] = requiredseo.map((item) => ({
    _id:item._id,
    url: item.url,
    title: item.title,
    description: item.description,
    h1: item.h1,
    canonical: item.canonical,
    ogUrl: item.ogUrl,
    ogTitle: item.ogTitle,
    ogDescription: item.ogDescription,
    ogImage: item.ogImage,
    seoSchema: item.seoSchema,
    metaRobots: item.metaRobots,
    altTag: item.altTag,
    schemaReview: item.schemaReview,
    keywords: item.keywords,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SeoClient
          data={JSON.parse(JSON.stringify(formattedSeo))}
        />
      </div>
    </div>
  );
};

export default SeoPage;
