const Review = require("../models/Review");
const ServiceProvider = require("../models/serviceProvider");

// =====================================================
// CREATE REVIEW
// =====================================================
const createReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!providerId || !rating || !comment) {
      return res.status(400).json({ message: "Provider, rating, and comment are required." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Ensure they haven't already reviewed this provider
    const existingReview = await Review.findOne({ providerId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this professional." });
    }

    const review = await Review.create({
      providerId,
      userId,
      rating: Number(rating),
      comment,
    });

    // Update the Provider's average rating and total reviews count
    const allReviews = await Review.find({ providerId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = (totalRating / allReviews.length).toFixed(1);

    await ServiceProvider.findByIdAndUpdate(providerId, {
      rating: averageRating,
      totalReviews: allReviews.length
    });

    return res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================================================
// GET PROVIDER REVIEWS
// =====================================================
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.json({ reviews });
  } catch (error) {
    console.error("Get provider reviews error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getProviderReviews
};
