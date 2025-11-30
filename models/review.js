import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, trim: true },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative. Enter between 0 and 5."],
      max: [5, "Rating cannot be greater than 5. Enter between 0 and 5."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
