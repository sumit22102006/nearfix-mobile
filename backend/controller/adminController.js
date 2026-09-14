const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// ==========================================
// ADMIN LOGIN
// ==========================================

const adminLogin = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }


    // ----------------------------------------
    // Check particular admin email
    // ----------------------------------------

    if (
      email.toLowerCase() !==
      process.env.ADMIN_EMAIL.toLowerCase()
    ) {

      return res.status(401).json({
        message:
          "You are not authorized as an admin",
      });

    }


    // ----------------------------------------
    // Find user
    // ----------------------------------------

    const user =
      await User.findOne({
        email: email.toLowerCase(),
      });


    if (!user) {
      return res.status(401).json({
        message:
          "Admin account does not exist",
      });
    }


    // ----------------------------------------
    // Check admin role
    // ----------------------------------------

    if (!user.roles.includes("admin")) {

      return res.status(403).json({
        message:
          "This account does not have admin access",
      });

    }


    // ----------------------------------------
    // Check password
    // ----------------------------------------

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordCorrect) {

      return res.status(401).json({
        message:
          "Invalid admin credentials",
      });

    }


    // ----------------------------------------
    // Generate token
    // ----------------------------------------

    const token =
      generateToken(user);


    res.json({

      message:
        "Admin login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },

    });

  } catch (error) {

    console.log(
      "Admin login error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


const ServiceProvider = require("../models/serviceProvider");
const Booking = require("../models/Booking");
const Category = require("../models/Category");

// ==========================================
// GET DASHBOARD STATS & ACTIVITY
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await ServiceProvider.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Fetch recent users for activity feed
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3).select('name createdAt roles');
    
    // Fetch recent bookings for activity feed
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(3)
      .populate('userId', 'name')
      .populate('providerId', 'businessName');

    // Combine and sort activities
    const activities = [
      ...recentUsers.map(u => ({
        id: u._id,
        type: u.roles.includes('provider') ? 'new_provider' : 'new_user',
        title: u.roles.includes('provider') ? `New Professional Joined` : `New User Registered`,
        description: `${u.name} just created an account.`,
        date: u.createdAt
      })),
      ...recentBookings.map(b => ({
        id: b._id,
        type: 'new_booking',
        title: `New Service Booked`,
        description: `${b.userId?.name} booked ${b.providerId?.businessName}`,
        date: b.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalCategories,
      recentActivity: activities
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// GET ALL PROVIDERS
// ==========================================
const getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find()
      .populate("userId", "name email phone")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// CREATE CATEGORY
// ==========================================
const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name, description, icon, isActive: true });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// TOGGLE CATEGORY
// ==========================================
const toggleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.isActive = !category.isActive;
    await category.save();

    res.json({ message: "Category toggled", category });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getAllProviders,
  createCategory,
  toggleCategory
};