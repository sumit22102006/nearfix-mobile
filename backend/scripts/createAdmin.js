const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB =
  require("../configure/db");

const User =
  require("../models/User");

dotenv.config();


const createAdmin = async () => {

  try {

    await connectDB();


    const adminEmail =
      process.env.ADMIN_EMAIL;


    const adminPassword =
      process.env.ADMIN_PASSWORD;


    if (
      !adminEmail ||
      !adminPassword
    ) {

      console.log(
        "ADMIN_EMAIL or ADMIN_PASSWORD missing"
      );

      process.exit(1);

    }


    // Check existing account
    const existingUser =
      await User.findOne({
        email: adminEmail.toLowerCase(),
      });


    if (existingUser) {

      // Add admin role if missing
      if (
        !existingUser.roles.includes(
          "admin"
        )
      ) {

        existingUser.roles.push(
          "admin"
        );

        await existingUser.save();

        console.log(
          "Admin role added to existing user"
        );

      } else {

        console.log(
          "Admin already exists"
        );

      }

      process.exit(0);
    }


    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        adminPassword,
        10
      );


    // Create admin
    const admin =
      await User.create({

        name: "NearFix Admin",

        email:
          adminEmail.toLowerCase(),

        phone: "0000000000",

        password:
          hashedPassword,

        roles: ["admin"],

      });


    console.log(
      "Admin created successfully"
    );

    console.log(
      "Admin ID:",
      admin._id
    );


    process.exit(0);

  } catch (error) {

    console.log(
      "Create admin error:",
      error
    );

    process.exit(1);
  }
};


createAdmin();