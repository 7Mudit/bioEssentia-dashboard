"use client";

import * as z from "zod";
import axios from "axios";
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

const formSchema = z.object({
  name: z.string().min(2),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});

type FlavourFormValues = z.infer<typeof formSchema>;

interface IFlavour {
  _id: string;
  storeId: string;
  name: string;
  value: string;
  products: string[]; // Reference to Product documents
  createdAt: Date;
  updatedAt: Date;
}

interface FlavourFormProps {
  initialData: IFlavour | null;
}

export const FlavourForm: React.FC<FlavourFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Flavour" : "Create Flavour";
  const description = initialData ? "Edit a Flavour." : "Add a new Flavour";
  const toastMessage = initialData ? "Flavour updated." : "Flavour created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<FlavourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: FlavourFormValues) => {
    const loadingId = toast.loading("Creating entry");
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/flavours/${params.flavourId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/flavours`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/flavours`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const onDelete = async () => {
    const loadingId = toast.loading("Deleting entry");
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/flavours/${params.flavourId}`);
      router.refresh();
      router.push(`/${params.storeId}/flavours`);
      toast.success("Flavour deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this flavour first."
      );
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
                      placeholder="Flavour name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Flavour value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
