const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  title: String,
  poster_path: String,
  vote_average: Number,
  release_date: String,
  overview: String,
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);