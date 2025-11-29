import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import mongoose from "mongoose";

// Helper: validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // ❌ Invalid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    return Response.json(listing, { status: 200 });
  } catch (error) {
    console.error("Error fetching list:", error);
    return Response.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // ❌ Invalid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updateData = {
      title: body.title?.trim() || "Untitled Venue",
      description: body.description?.trim() || "No description provided",
      image: body.image?.trim() || "https://via.placeholder.com/1600x900?text=No+Image",
      price: body.price !== undefined ? Number(body.price) : null,
      location: body.location?.trim() || "Unknown City",
      country: body.country?.trim() || "Unknown Country",
      capacity: body.capacity !== undefined ? Number(body.capacity) : null,
      rating: body.rating !== undefined ? Number(body.rating) : null,
      amenities: Array.isArray(body.amenities)
        ? body.amenities.map((a) => a.trim()).filter(Boolean)
        : [],
      contactEmail: body.contactEmail?.trim() || null,
      contactPhone: body.contactPhone?.trim() || null,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : false,
    };

    const updatedVenue = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVenue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    return Response.json(updatedVenue, { status: 200 });
  } catch (error) {
    console.error("Error updating venue:", error);

    let message = "Failed to update venue";
    if (error.name === "ValidationError") {
      message = Object.values(error.errors)[0].message;
    }

    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // ❌ Invalid ObjectId
    if (!isValidObjectId(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deletedVenue = await Listing.findByIdAndDelete(id);

    if (!deletedVenue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    return Response.json(deletedVenue, { status: 200 });
  } catch (error) {
    console.error("Error deleting venue:", error);
    return Response.json({ error: "Failed to delete venue" }, { status: 500 });
  }
}
