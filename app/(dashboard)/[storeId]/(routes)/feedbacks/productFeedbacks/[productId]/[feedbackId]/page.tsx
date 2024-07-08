import { connectToDb } from "@/lib/mongoose";
import { FeedbackForm } from "./component/feedback-form";
import Feedback from "@/models/feedback.model";

const FeedbackPage = async ({ params }: { params: { feedbackId: string } }) => {
  await connectToDb();
  let feedback = null;

  try {
    if (params.feedbackId !== "new") {
      feedback = await Feedback.findOne({ _id: params.feedbackId }).lean();
      if (!feedback) {
        throw new Error("Feedback not found");
      }
    }
  } catch (error) {
    console.error(
      `Error fetching feedback with ID ${params.feedbackId}:`,
      error
    );
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <p>Error loading feedback. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FeedbackForm
          initialData={feedback ? JSON.parse(JSON.stringify(feedback)) : null}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
