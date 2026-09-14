const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config({ path: ".env" });

const categoriesToSeed = [
  { name: "electrician", icon: "electrical-services", description: "Electrical repair and installation" },
  { name: "plumber", icon: "plumbing", description: "Plumbing repair and installation" },
  { name: "ac repair", icon: "ac-unit", description: "AC servicing and repair" },
  { name: "cleaning", icon: "cleaning-services", description: "Home and office cleaning" },
  { name: "carpenter", icon: "carpenter", description: "Woodwork and furniture repair" },
  { name: "painting", icon: "format-paint", description: "Wall and house painting" },
  { name: "appliance", icon: "kitchen", description: "Home appliance repair" },
  { name: "pest control", icon: "pest-control", description: "Pest control services" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Remove existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories.");

    // Insert new categories
    await Category.insertMany(categoriesToSeed);
    console.log("Categories seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
