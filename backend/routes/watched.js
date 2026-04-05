const express = require("express");
const Watched = require("../models/Watched");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all watched items for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const watched = await Watched.find({ userId: req.user.id });
    res.json(watched);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add to watched
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date, overview, userRating } = req.body;

    const existing = await Watched.findOne({ userId: req.user.id, movieId });
    if (existing) {
      existing.userRating = userRating;
      await existing.save();
      return res.json(existing);
    }

    const item = new Watched({
      userId: req.user.id,
      movieId, title, poster_path, vote_average, release_date, overview, userRating
    });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove from watched
router.delete("/:movieId", authMiddleware, async (req, res) => {
  try {
    await Watched.findOneAndDelete({ userId: req.user.id, movieId: req.params.movieId });
    res.json({ message: "Removed from watched" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;