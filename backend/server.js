const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");

const  connectDB = require("./configure/db");


// Routes 


const authRoutes =
 require("./routes/authRoutes");

const categoryRoutes = 
require("./routes/categoryRoute");

const providerRoutes = 
require("./routes/providerRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const bookingRoutes = 
  require("./routes/bookingRoutes");

const reviewRoutes = 
  require("./routes/reviewRoutes");

dotenv.config();


connectDB();

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

  res.json({
    message:
      "NearFix Backend is running",
  });

});

// ROUTES API

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
)

app.use(
  "/api/providers",
  providerRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

