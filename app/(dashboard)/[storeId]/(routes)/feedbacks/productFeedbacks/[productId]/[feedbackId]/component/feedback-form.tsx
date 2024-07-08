"use client";

import * as z from "zod";
import mongoose from "mongoose";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createFeedback,
  updateFeedbackById,
  deleteFeedbackById,
} from "@/lib/actions/feedback.action";

const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  feedback: z.string().min(1, "Comment is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  approved: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof formSchema>;

interface IFeedback {
  _id: string;
  userName: string;
  feedback: string;
  productId: string;
  rating: number;
  approved: boolean;
}

interface FeedbackFormProps {
  initialData: IFeedback | null;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit feedback" : "Create feedback";
  const description = initialData ? "Edit a feedback." : "Add a new feedback";
  const toastMessage = initialData ? "Feedback updated." : "Feedback created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      feedback: "",
      rating: 1,
      approved: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        userName: initialData.userName,
        feedback: initialData.feedback,
        rating: initialData.rating,
        approved: initialData.approved,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: FeedbackFormValues) => {
    const loadingId = toast.loading("Processing...");

    const obj = {
      userName: data.userName,
      feedback: data.feedback,
      rating: data.rating,
      approved: data.approved,
      productId: new mongoose.Types.ObjectId(params.productId as string),
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateFeedbackById(
          new mongoose.Types.ObjectId(params.feedbackId as string),
          obj
        );
      } else {
        await createFeedback(obj);
      }

      router.refresh();
      router.push(
        `/${params.storeId}/feedbacks/productFeedbacks/${params.productId}`
      );
      router.refresh();
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
      await deleteFeedbackById(
        new mongoose.Types.ObjectId(params.feedbackId as string)
      );

      router.refresh();
      router.push(
        `/${params.storeId}/feedbacks/productFeedbacks/${params.productId}`
      );
      router.refresh();
      toast.success("Feedback deleted.");
    } catch (error: any) {
      toast.error("Error occurred while deleting feedback.");
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
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="User Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Comment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="approved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approved</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? "Yes" : "No"}
                      onValueChange={(value) => field.onChange(value === "Yes")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approval status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
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
