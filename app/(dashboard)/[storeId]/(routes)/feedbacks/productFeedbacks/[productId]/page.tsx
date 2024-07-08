import { format } from "date-fns";

import { FeedbackColumn } from "./components/column";
import { FeedbackClient } from "./components/client";

import { fetchProductById } from "@/lib/actions/product.action";

const FeedbackPage = async ({ params }: { params: { productId: string } }) => {
  const product = await fetchProductById(params.productId);
  const formattedFeedbacks: FeedbackColumn[] = product.feedbacks.map(
    (item: any) => ({
      id: item._id,
      userName: item.userName,
      feedback: item.feedback,
      rating: item.rating,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      approved: item.approved, // Include approved status
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeedbackClient data={JSON.parse(JSON.stringify(formattedFeedbacks))} />
      </div>
    </div>
  );
};

export default FeedbackPage;
