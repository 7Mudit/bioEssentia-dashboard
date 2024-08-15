"use client";

import * as z from "zod";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  createSeoMetadata,
  updateSeoMetadataById,
  deleteSeoMetadataById,
} from "@/lib/actions/seo.action";
import mongoose from "mongoose";

const formSchema = z.object({
  url: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(2),
  h1: z.string().min(2),
  canonical: z.string().min(2),
  ogUrl: z.string().min(2),
  ogTitle: z.string().min(2),
  ogDescription: z.string().min(2),
  ogImage: z.string().min(2),
  seoSchema: z.string().optional(),
  metaRobots: z.string().min(2),
  altTag: z.string().min(2),
  schemaReview: z.string().optional(),
  keywords: z.string().min(2),
});

type SeoFormValues = z.infer<typeof formSchema>;

interface ISeo extends Document {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  url: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  seoSchema?: string;
  metaRobots: string;
  altTag: string;
  schemaReview?: string;
  keywords: string;
}

interface SeoFormProps {
  initialData: ISeo | null;
}

export const SeoForm: React.FC<SeoFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit SEO" : "Create SEO";
  const description = initialData ? "Edit a SEO." : "Add a new SEO";
  const toastMessage = initialData ? "SEO updated." : "SEO created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      url: "",
      title: "",
      description: "",
      h1: "",
      canonical: "",
      ogUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      seoSchema: "",
      metaRobots: "",
      altTag: "",
      schemaReview: "",
      keywords: "",
    },
  });

  const onSubmit = async (data: SeoFormValues) => {
    const loadingId = toast.loading("Creating SEO");
    console.log("this is type of params : ", typeof params.storeId);
    const storeid = Array.isArray(params.storeId)
      ? params.storeId[0]
      : params.storeId;

    try {
      setLoading(true);
      if (initialData) {
        await updateSeoMetadataById(initialData._id, data);
      } else {
        await createSeoMetadata({ ...data, storeId: storeid });
      }
      router.refresh();
      router.push(`/${params.storeId}/seo`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const onDelete = async () => {
    const loadingId = toast.loading("Deleting SEO");
    const seoid = Array.isArray(params.seoId) ? params.seoId[0] : params.seoId;
    try {
      setLoading(true);
      const deleteResponse = await deleteSeoMetadataById(
        new mongoose.Types.ObjectId(seoid)
      );
      router.refresh();
      router.push(`/${params.storeId}/seo`);
      toast.success("SEO deleted.");
    } catch (error: any) {
      toast.error("Error occurred");
    } finally {
      setLoading(false);
      setOpen(false);
      toast.dismiss(loadingId);
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
          <div className="md:grid md:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="h1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>H1</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="H1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canonical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Canonical"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG URL</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="OG URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="OG Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="OG Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="OG Image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoSchema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Schema</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="SEO Schema"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaRobots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Robots</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Meta Robots"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="altTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Tag</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Alt Tag"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schemaReview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema Review</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Schema Review"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Keywords"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
