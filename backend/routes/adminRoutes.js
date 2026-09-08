const express = require("express");

const {
  adminLogin,
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


// ==========================================
// ADMIN TEST
// ==========================================

router.get(
  "/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {

    res.json({
      message:
        "Welcome to NearFix Admin",
    });

  }
);


module.exports = router;