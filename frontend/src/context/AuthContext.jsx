import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  fetchWatchlist,
  fetchWatched,
  addToWatchlist,
  removeFromWatchlist,
  addToWatched,
  removeFromWatched,
} from "../authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setAuthLoading(false);
  }, []);

  // When token changes, load watchlist & watched from backend
  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setWatchlist([]);
      setWatched([]);
    }
  }, [token]);

  const loadUserData = async () => {
    try {
      const [wl, wd] = await Promise.all([fetchWatchlist(), fetchWatched()]);
      // Map backend data to match frontend format (id instead of movieId)
      setWatchlist(wl.map((item) => ({
        id: item.movieId,
        title: item.title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date,
        overview: item.overview,
      })));
      setWatched(wd.map((item) => ({
        id: item.movieId,
        title: item.title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date,
        overview: item.overview,
        userRating: item.userRating,
      })));
    } catch (error) {
      console.error("Failed to load user data:", error);
      // If token is invalid, log out
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await registerUser(username, email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setWatchlist([]);
    setWatched([]);
  };

  const toggleWatchlist = async (movie) => {
    if (!user) return; // must be logged in
    const exists = watchlist.find((m) => m.id === movie.id);
    try {
      if (exists) {
        await removeFromWatchlist(movie.id);
        setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
      } else {
        await addToWatchlist(movie);
        setWatchlist((prev) => [...prev, movie]);
      }
    } catch (error) {
      console.error("Watchlist error:", error);
    }
  };

  const toggleWatched = async (movie, rating) => {
    if (!user) return; // must be logged in
    try {
      if (rating === null) {
        await removeFromWatched(movie.id);
        setWatched((prev) => prev.filter((m) => m.id !== movie.id));
      } else {
        await addToWatched(movie, rating);
        const exists = watched.find((m) => m.id === movie.id);
        if (exists) {
          setWatched((prev) =>
            prev.map((m) => (m.id === movie.id ? { ...m, userRating: rating } : m))
          );
        } else {
          setWatched((prev) => [...prev, { ...movie, userRating: rating }]);
        }
      }
    } catch (error) {
      console.error("Watched error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        watchlist,
        watched,
        login,
        register,
        logout,
        toggleWatchlist,
        toggleWatched,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
