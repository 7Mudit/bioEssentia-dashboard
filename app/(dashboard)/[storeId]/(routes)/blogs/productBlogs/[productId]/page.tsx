import { format } from "date-fns";
import { BlogColumn } from "./components/column";
import { BlogClient } from "./components/client";
import { fetchProductBlogsById } from "@/lib/actions/blog.action";

const BlogPage = async ({ params }: { params: { productId: string } }) => {
  let products;
  let product = await fetchProductBlogsById(params.productId);
  if (product.success) {
    products = product.product;
  }

  const formattedBlogs: BlogColumn[] = products.blogs.map((item: any) => ({
    id: item._id,
    title: item.title,
    content: item.content,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogClient data={JSON.parse(JSON.stringify(formattedBlogs))} />
      </div>
    </div>
  );
};

export default BlogPage;
