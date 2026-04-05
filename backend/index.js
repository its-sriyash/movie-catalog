const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const watchedRoutes = require("./routes/watched");
const tmdbRoutes = require("./routes/tmdb");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean)
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "CineScope API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/watched", watchedRoutes);
app.use("/api/tmdb", tmdbRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));