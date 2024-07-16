"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { BlogColumns, BlogColumn } from "./column";

interface BlogClientProps {
  data: BlogColumn[];
}

export const BlogClient: React.FC<BlogClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Blogs (${data.length})`}
          description="Manage blogs for your product"
        />
        <Button
          onClick={() =>
            router.push(
              `/${params.storeId}/blogs/productBlogs/${params.productId}/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={BlogColumns} data={data} />
    </>
  );
};
