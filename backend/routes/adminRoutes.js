const express = require("express");

const {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getAllProviders,
  createCategory,
  toggleCategory,
} = require("../controller/adminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router =
  express.Router();


// ==========================================
// ADMIN LOGIN
// ==========================================

router.post(
  "/login",
  adminLogin
);


// Protected Admin Routes
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/providers", authMiddleware, adminMiddleware, getAllProviders);
router.post("/categories", authMiddleware, adminMiddleware, createCategory);
router.put("/categories/:id/toggle", authMiddleware, adminMiddleware, toggleCategory);


module.exports = router;