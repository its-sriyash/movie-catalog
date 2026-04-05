const express = require("express");
const Watchlist = require("../models/Watchlist");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all watchlist items for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add to watchlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date, overview } = req.body;

    const existing = await Watchlist.findOne({ userId: req.user.id, movieId });
    if (existing) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    const item = new Watchlist({
      userId: req.user.id,
      movieId, title, poster_path, vote_average, release_date, overview
    });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove from watchlist
router.delete("/:movieId", authMiddleware, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ userId: req.user.id, movieId: req.params.movieId });
    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;