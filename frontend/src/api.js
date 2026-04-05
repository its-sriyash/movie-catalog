import axios from "axios";

const BASE_URL = "http://localhost:5000/api/tmdb";

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/popular`, { params: { page } });
    return response.data.results;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, { params: { query } });
    return response.data.results;
  } catch (error) {
    console.error("Search Error:", error.response?.data);
    return [];
  }
};

export const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genres`);
    return response.data.genres;
  } catch (error) {
    console.error("Genres Error:", error.response?.data);
    return [];
  }
};

export const discoverMovies = async (filters, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover`, {
      params: { 
        genre_id: filters.genreId, 
        sort_by: filters.sortBy,
        year: filters.year,
        language: filters.language,
        min_rating: filters.minRating,
        runtime: filters.runtime,
        page 
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Discover Movies Error:", error.response?.data);
    return [];
  }
};

export const discoverByMood = async (mood, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/mood`, {
      params: { mood, page },
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Mood Discover Error:", error.response?.data);
    return [];
  }
};

export const getSimilarMovies = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar`);
    return response.data.results.filter((m) => m.poster_path);
  } catch (error) {
    console.error("Similar Movies Error:", error.response?.data);
    return [];
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`);
    const trailer = response.data.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Videos Error:", error);
    return null;
  }
};