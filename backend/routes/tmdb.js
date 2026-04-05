const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

// Helper: forward a TMDB request and return the data
const tmdb = (path, params = {}) =>
  axios.get(`${TMDB_BASE}${path}`, {
    params: { api_key: TMDB_API_KEY, ...params },
  });

// GET /api/tmdb/popular?page=1
router.get("/popular", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdb("/movie/popular", { language: "en-US", page });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch popular movies", error: err.message });
  }
});

// GET /api/tmdb/search?query=...
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const { data } = await tmdb("/search/movie", { query });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to search movies", error: err.message });
  }
});

// GET /api/tmdb/genres
router.get("/genres", async (req, res) => {
  try {
    const { data } = await tmdb("/genre/movie/list", { language: "en-US" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch genres", error: err.message });
  }
});

// GET /api/tmdb/discover
router.get("/discover", async (req, res) => {
  try {
    const { 
      genre_id, 
      page = 1, 
      sort_by = "vote_average.desc",
      year,
      language,
      min_rating,
      runtime
    } = req.query;

    const params = {
      sort_by,
      page,
      "vote_count.gte": 100 // Ensures we don't get obscure highly rated movies when sorting by rating
    };

    if (genre_id) params.with_genres = genre_id;
    if (year) params.primary_release_year = year;
    if (language) params.with_original_language = language;
    if (min_rating) params["vote_average.gte"] = min_rating;

    if (runtime === "short") {
      params["with_runtime.lte"] = 90;
    } else if (runtime === "medium") {
      params["with_runtime.gte"] = 90;
      params["with_runtime.lte"] = 120;
    } else if (runtime === "long") {
      params["with_runtime.gte"] = 120;
    }

    const { data } = await tmdb("/discover/movie", params);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top movies", error: err.message });
  }
});

// GET /api/tmdb/discover/mood?mood=...
router.get("/discover/mood", async (req, res) => {
  try {
    const { mood = "", page = 1 } = req.query;
    const lowerMood = mood.toLowerCase();

    // -- Custom Mood Hardcodes for Complex Abstract Concepts -- //
    
    // "Highest-Rated" -> TMDB Top Rated endpoint
    if (lowerMood === "highest-rated" || lowerMood === "highest rated" || lowerMood === "top rated") {
      const topRatedRes = await tmdb("/movie/top_rated", {
        language: "en-US",
        page,
      });
      return res.json(topRatedRes.data);
    }

    // "Fast-Paced" -> Action (28), Thriller (53)
    if (lowerMood === "fast-paced" || lowerMood === "fast paced") {
      const discoverRes = await tmdb("/discover/movie", {
        with_genres: "28,53", // Action or Thriller
        sort_by: "popularity.desc",
        page,
      });
      return res.json(discoverRes.data);
    }

    // "Midnight watch" -> Horror, Thriller, Cult, high popularity
    if (lowerMood === "midnight watch" || lowerMood === "midnight mood") {
      const discoverRes = await tmdb("/discover/movie", {
        with_genres: "27,53", // Horror or Thriller
        sort_by: "popularity.desc",
        page,
      });
      return res.json(discoverRes.data);
    }

    // "Feel-Good" -> Comedy, Family, positive vibes
    if (lowerMood === "feel-good" || lowerMood === "feel good") {
      const discoverRes = await tmdb("/discover/movie", {
        with_genres: "35,10751", // Comedy + Family
        without_genres: "16", // 16 = Animation (Removes all Cartoons)
        sort_by: "popularity.desc",
        page,
      });
      return res.json(discoverRes.data);
    }

    // 1. Find the TMDB keyword ID for the given mood/niche
    const keywordRes = await tmdb("/search/keyword", { query: mood });
    
    if (!keywordRes.data.results || keywordRes.data.results.length === 0) {
      // Fallback to text search if keyword doesn't exist in TMDB entirely
      const searchRes = await tmdb("/search/movie", { query: mood, page });
      return res.json(searchRes.data);
    }
    
    // Take the exact first match's ID
    const keywordId = keywordRes.data.results[0].id;

    // 2. Discover movies officially tagged with that keyword
    const discoverRes = await tmdb("/discover/movie", {
      with_keywords: keywordId,
      sort_by: "popularity.desc",
      page,
    });
    
    res.json(discoverRes.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies by mood", error: err.message });
  }
});

// GET /api/tmdb/movie/:id  (includes credits)
router.get("/movie/:id", async (req, res) => {
  try {
    const { data } = await tmdb(`/movie/${req.params.id}`, {
      append_to_response: "credits",
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movie details", error: err.message });
  }
});

// GET /api/tmdb/movie/:id/similar
router.get("/movie/:id/similar", async (req, res) => {
  try {
    const { data } = await tmdb(`/movie/${req.params.id}/similar`, {
      language: "en-US",
      page: 1,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch similar movies", error: err.message });
  }
});

// GET /api/tmdb/movie/:id/videos
router.get("/movie/:id/videos", async (req, res) => {
  try {
    const { data } = await tmdb(`/movie/${req.params.id}/videos`, {
      language: "en-US",
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos", error: err.message });
  }
});

module.exports = router;
