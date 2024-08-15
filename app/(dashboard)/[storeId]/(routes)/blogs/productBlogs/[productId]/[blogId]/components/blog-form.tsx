"use client";

import * as z from "zod";
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@/components/editor/TailwindEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditorInstance, JSONContent } from "novel";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  createBlogForProduct,
  updateBlogById,
  deleteBlogById,
} from "@/lib/actions/blog.action";

const formSchema = z.object({
  title: z.string().min(1),
  content: z.any().optional(),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialData: BlogFormValues | null;
  productId: string;
  storeId: string;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  productId,
  storeId,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<JSONContent | {}>(
    initialData?.content || {}
  );
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Unsaved">("Unsaved");
  const editorRef = useRef<EditorInstance>(null);

  const title = initialData ? "Edit Blog" : "Create Blog";
  const description = initialData ? "Edit a blog." : "Add a new blog";
  const toastMessage = initialData ? "Blog updated." : "Blog created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: {},
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setLoading(true);

      // Use editorRef to get the content
      const editorContent = editorRef.current?.getJSON();
      data.content = editorContent || content;

      if (initialData) {
        let newContent = JSON.stringify(data);
        await updateBlogById(params.blogId as string, newContent);
      } else {
        let newContent = JSON.stringify(data);
        await createBlogForProduct(productId as string, newContent);
      }

      router.refresh();
      router.push(`/${storeId}/blogs/productBlogs/${productId}`);
      toast.success(toastMessage);
      setSaveStatus("Saved");
    } catch (error: any) {
      console.error("Error during submit:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteBlogById(params.blogId as string);
      router.refresh();
      router.push(`/${storeId}/blogs/productBlogs/${productId}`);
      toast.success("Blog deleted.");
    } catch (error: any) {
      console.error("Error during delete:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Blog title"
                {...form.register("title")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Editor
                className="border-2 dark:border"
                ref={editorRef}
                setSaveStatus={setSaveStatus}
                blog={content as JSONContent}
                // onChange={handleContentChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
