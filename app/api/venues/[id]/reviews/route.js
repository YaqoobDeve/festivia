import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import Review from "@/models/review";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const { rating, comment } = await req.json();
 if (rating === undefined || rating === null) {
    return Response.json(
      { error: "Rating is required" },
      { status: 400 }
    );
  }

  if (typeof rating !== "number" || rating <= 0 || rating > 5) {
    return Response.json(
      { error: "Rating must be a number between 0 and 5" },
      { status: 400 }
    );
  }

  if (!comment || comment.trim().length === 0) {
    return Response.json(
      { error: "Comment is required" },
      { status: 400 }
    );
  }

    // 1️⃣ Create a review document
    const newReview = await Review.create({
      rating,
      comment,
    });

    // 2️⃣ Push ONLY the review._id into listing
    const venue = await Listing.findById(id).populate("reviews");

    if (!venue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    venue.reviews.push(newReview._id); // ✅ FIXED HERE

    await venue.save();

    return Response.json(newReview, { status: 201 });

  } catch (error) {
    console.error("Review POST error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
