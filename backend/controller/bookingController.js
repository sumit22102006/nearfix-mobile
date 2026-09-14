const Booking = require("../models/Booking");
const ServiceProvider = require("../models/serviceProvider");

// =====================================================
// CREATE BOOKING (User)
// =====================================================
const createBooking = async (req, res) => {
  try {
    const { providerId, serviceDate, notes, address } = req.body;
    const userId = req.user.userId;

    if (!providerId || !serviceDate || !address) {
      return res.status(400).json({ message: "Provider, Date, and Address are required." });
    }

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Professional not found." });
    }

    const booking = await Booking.create({
      userId,
      providerId,
      serviceDate,
      notes,
      address,
      price: provider.price,
    });

    return res.status(201).json({ message: "Booking requested successfully!", booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================================================
// GET MY BOOKINGS (User)
// =====================================================
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ userId })
      .populate({
        path: "providerId",
        populate: { path: "userId categoryId", select: "name phone icon" }
      })
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// GET PROVIDER BOOKINGS (Professional)
// =====================================================
const getProviderBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find the provider profile for this user
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ message: "Professional profile not found." });
    }

    const bookings = await Booking.find({ providerId: provider._id })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    console.error("Get provider bookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// UPDATE BOOKING STATUS (Professional)
// =====================================================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    if (!["accepted", "rejected", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verify the user owns the provider profile this booking is for
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider || provider._id.toString() !== booking.providerId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking." });
    }

    booking.status = status;
    await booking.save();

    return res.json({ message: `Booking marked as ${status}`, booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus
};
