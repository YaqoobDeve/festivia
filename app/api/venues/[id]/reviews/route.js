import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return Response.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    const venue = await Listing.findById(id);
    if (!venue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    const review = { rating, comment, date: new Date() };

    venue.reviews = venue.reviews || [];
    venue.reviews.push(review);

    await venue.save();

    return Response.json({ message: "Review added", review }, { status: 201 });

  } catch (err) {
    console.error("Review POST error:", err);
    return Response.json({ error: "Failed to add review" }, { status: 500 });
  }
}
