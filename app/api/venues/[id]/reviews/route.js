import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import Review from "@/models/review";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const { rating, comment } = await req.json();

    // 1️⃣ Create a review document
    const newReview = await Review.create({
      rating,
      comment,
    });

    // 2️⃣ Push ONLY the review._id into listing
    const venue = await Listing.findById(id);

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
