import { format } from "date-fns";

import { SeoColumn } from "./components/columns";
import { SeoClient } from "./components/client";
import { fetchAllSeoMetadata } from "@/lib/actions/seo.action";

const SeoPage = async ({ params }: { params: { storeId: string } }) => {
  const requiredseo = await fetchAllSeoMetadata();

  const formattedSeo: SeoColumn[] = requiredseo.map((item) => ({
    _id: item._id,
    url: item.url,
    title: item.title,
    description: item.description,
    h1: item.h1,
    canonical: item.canonical,
    ogUrl: item.ogUrl,
    ogTitle: item.ogTitle,
    ogDescription: item.ogDescription,
    ogImage: item.ogImage,
    metaRobots: item.metaRobots,
    altTag: item.altTag,
    keywords: item.keywords,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SeoClient data={JSON.parse(JSON.stringify(formattedSeo))} />
      </div>
    </div>
  );
};

export default SeoPage;
