const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus
} = require("../controller/bookingController");

// User routes
router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);

// Provider routes
router.get("/provider", authMiddleware, getProviderBookings);
router.put("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;
