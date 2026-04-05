import axios from "axios";

const API_URL = "http://localhost:5000/api";

// --- Auth ---
export const registerUser = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

// --- Helper: get auth header ---
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Watchlist ---
export const fetchWatchlist = async () => {
  const res = await axios.get(`${API_URL}/watchlist`, { headers: authHeader() });
  return res.data;
};

export const addToWatchlist = async (movie) => {
  const res = await axios.post(`${API_URL}/watchlist`, {
    movieId: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
  }, { headers: authHeader() });
  return res.data;
};

export const removeFromWatchlist = async (movieId) => {
  const res = await axios.delete(`${API_URL}/watchlist/${movieId}`, { headers: authHeader() });
  return res.data;
};

// --- Watched ---
export const fetchWatched = async () => {
  const res = await axios.get(`${API_URL}/watched`, { headers: authHeader() });
  return res.data;
};

export const addToWatched = async (movie, userRating) => {
  const res = await axios.post(`${API_URL}/watched`, {
    movieId: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
    userRating,
  }, { headers: authHeader() });
  return res.data;
};

export const removeFromWatched = async (movieId) => {
  const res = await axios.delete(`${API_URL}/watched/${movieId}`, { headers: authHeader() });
  return res.data;
};
