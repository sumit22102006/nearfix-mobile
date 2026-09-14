const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createReview, getProviderReviews } = require("../controller/reviewController");

router.post("/", authMiddleware, createReview);
router.get("/provider/:providerId", getProviderReviews);

module.exports = router;
