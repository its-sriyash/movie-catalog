const mongoose = require("mongoose");

const watchedSchema = new mongoose.Schema({
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
  userRating: {
    type: Number,
    min: 1,
    max: 10,
  },
}, { timestamps: true });

module.exports = mongoose.model("Watched", watchedSchema);