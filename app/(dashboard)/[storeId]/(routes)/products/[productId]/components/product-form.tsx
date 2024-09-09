"use client";

import * as z from "zod";
import axios from "axios";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@/components/editor/TailwindEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { EditorInstance, JSONContent } from "novel";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  features: z.array(z.string()).optional(),
  content: z.any().optional(),
  contentHTML: z.string().optional(),
  categoryId: z.string().min(1),
  flavourId: z.array(z.string()).min(1),
  sizes: z.array(
    z.object({
      sizeId: z.string(),
      price: z.coerce.number().min(0),
      fakePrice: z.coerce.number().min(0),
    })
  ),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ICategory {
  _id: string;
  storeId: string;
  billboardId: string;
  products: string[];
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IProduct {
  _id: string;
  storeId: string;
  categoryId: string;
  name: string;
  features?: string[];
  content?: JSONContent;
  contentHTML?: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizes: { sizeId: string; price: number; fakePrice: number }[];
  flavourId: string[];
  images: string[];
  orderItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IFlavour {
  _id: string;
  storeId: string;
  name: string;
  value: string;
  products: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ISize {
  _id: string;
  storeId: string;
  name: string;
  value: string;
  products: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IImage {
  _id: string;
  productId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductFormProps {
  initialData:
    | (IProduct & {
        images: IImage[];
      })
    | null;
  categories: ICategory[];
  flavours: IFlavour[];
  sizes: ISize[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  flavours,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Unsaved">("Unsaved");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<EditorInstance>(null);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const [content, setContent] = useState<JSONContent | {}>(
    initialData?.content || {}
  );

  const defaultValues = initialData
    ? {
        ...initialData,
        sizes: initialData?.sizes || [],
        features: initialData?.features || [],
      }
    : {
        name: "",
        images: [],
        sizes: sizes.map((size) => ({
          sizeId: size._id,
          price: 0,
          fakePrice: 0,
        })),
        features: [],
        content: {},
        categoryId: "",
        contentHTML: "",
        flavourId: [],
        isFeatured: false,
        isArchived: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const editorContent = editorRef.current?.getJSON();
      const editorContentHTML = editorRef.current?.getHTML();
      data.content = editorContent || content;
      data.content = JSON.stringify(data.content);
      data.contentHTML = editorContentHTML || "";
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const [featureInput, setFeatureInput] = useState("");
  const addFeature = () => {
    if (featureInput.trim()) {
      form.setValue("features", [
        ...(form.getValues("features") || []),
        featureInput,
      ]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = (form.getValues("features") || []).filter(
      (_, i) => i !== index
    );
    form.setValue("features", newFeatures);
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <FormLabel>Size, Price & Fake Price</FormLabel>
                  {sizes.map((size) => (
                    <div key={size._id} className="flex items-center space-x-4">
                      <Checkbox
                        checked={form
                          .watch("sizes")
                          .some((s) => s.sizeId === size._id)}
                        onCheckedChange={(checked) => {
                          const currentSizes = form.getValues("sizes") || [];
                          if (checked) {
                            form.setValue("sizes", [
                              ...currentSizes,
                              { sizeId: size._id, price: 0, fakePrice: 0 },
                            ]);
                          } else {
                            form.setValue(
                              "sizes",
                              currentSizes.filter((s) => s.sizeId !== size._id)
                            );
                          }
                        }}
                      />
                      <span>{size.name}</span>
                      {form
                        .watch("sizes")
                        .some((s) => s.sizeId === size._id) && (
                        <>
                          <Input
                            type="number"
                            placeholder="Price"
                            value={
                              form
                                .watch("sizes")
                                .find((s) => s.sizeId === size._id)?.price || 0
                            }
                            onChange={(e) =>
                              form.setValue(
                                "sizes",
                                form
                                  .watch("sizes")
                                  .map((s) =>
                                    s.sizeId === size._id
                                      ? { ...s, price: Number(e.target.value) }
                                      : s
                                  )
                              )
                            }
                            disabled={loading}
                            className="w-24"
                          />
                          <Input
                            type="number"
                            placeholder="Fake Price"
                            value={
                              form
                                .watch("sizes")
                                .find((s) => s.sizeId === size._id)
                                ?.fakePrice || 0
                            }
                            onChange={(e) =>
                              form.setValue(
                                "sizes",
                                form
                                  .watch("sizes")
                                  .map((s) =>
                                    s.sizeId === size._id
                                      ? {
                                          ...s,
                                          fakePrice: Number(e.target.value),
                                        }
                                      : s
                                  )
                              )
                            }
                            disabled={loading}
                            className="w-24"
                          />
                        </>
                      )}
                    </div>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flavourId"
              render={() => (
                <FormItem>
                  <FormLabel>Flavour</FormLabel>
                  {flavours.map((item) => (
                    <FormField
                      key={item._id}
                      control={form.control}
                      name="flavourId"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item._id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item._id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item._id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Editor
                className="border-2 dark:border"
                ref={editorRef}
                setSaveStatus={setSaveStatus}
                blog={content as JSONContent}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <div className="space-y-4">
                  {(form.watch("features") || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-4">
                    <Input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                    />
                    <Button type="button" onClick={addFeature}>
                      Add
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
