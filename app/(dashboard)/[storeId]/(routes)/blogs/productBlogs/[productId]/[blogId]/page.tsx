import { BlogForm } from "./components/blog-form";
import { fetchBlogById } from "@/lib/actions/blog.action";

const BlogPage = async ({
  params,
}: {
  params: { blogId: string; productId: string; storeId: string };
}) => {
  let blog;
  if (params.blogId === "new") {
    blog = null;
  } else {
    blog = await fetchBlogById(params.blogId);
    if (blog.success) {
      blog = JSON.parse(blog.blog);
    } else {
      blog = null;
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogForm
          initialData={JSON.parse(JSON.stringify(blog))}
          productId={params.productId}
          storeId={params.storeId}
        />
      </div>
    </div>
  );
};

export default BlogPage;
