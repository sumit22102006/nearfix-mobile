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


module.exports = {
  adminLogin,
};