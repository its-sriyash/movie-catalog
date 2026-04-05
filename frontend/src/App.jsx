import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import GenreFilter from "./components/GenreFilter";
import HeroSection from "./components/HeroSection";
import { searchMovies, getPopularMovies, getGenres, discoverMovies, discoverByMood } from "./api";
import FilterControls from "./components/FilterControls";
import MovieDetail from "./pages/MovieDetail";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function Home({ movies, heroMovie, loading, error, showWatchlist, setShowWatchlist, handleSearch, handleMoodSelect, genres, selectedGenre, handleGenreSelect, activeFilters, handleFilterChange, handleLoadMore, loadingMore, showWatched, setShowWatched, searchQuery, selectedMood }) {
  const { watchlist, watched, toggleWatchlist, toggleWatched, user } = useAuth();

  const movieCardProps = (movie) => ({
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average,
    overview: movie.overview,
    releaseDate: movie.release_date,
    inWatchlist: !!watchlist.find((m) => m.id === movie.id),
    onAddToWatchlist: () => {
      if (!user) {
        alert("Please sign in to use the watchlist!");
        return;
      }
      toggleWatchlist(movie);
    },
    isWatched: !!watched.find((m) => m.id === movie.id),
    watchedRating: watched.find((m) => m.id === movie.id)?.userRating,
    onMarkWatched: (rating) => {
      if (!user) {
        alert("Please sign in to mark movies as watched!");
        return;
      }
      toggleWatched(movie, rating);
    },
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://dummyimage.com/300x450/1f1f1f/ffffff&text=No+Image",
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar
        onSearch={handleSearch}
        onMoodSelect={handleMoodSelect}
        watchlistCount={watchlist.length}
        onWatchlistClick={() => { setShowWatchlist(!showWatchlist); setShowWatched(false); }}
        watchedCount={watched.length}
        onWatchedClick={() => { setShowWatched(!showWatched); setShowWatchlist(false); }}
      />

      <HeroSection movie={heroMovie} />

      {!searchQuery && !selectedMood && (
        <>
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={handleGenreSelect}
          />
          <FilterControls 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
            disabled={loading} 
          />
        </>
      )}

      {showWatched && (
        <div style={{ padding: "0 20px 20px" }}>
          <h2 style={{ color: "white" }}>✓ Watched Movies ({watched.length})</h2>
          <div className="movie-grid">
            {watched.length === 0 ? (
              <p style={{ color: "#aaa" }}>No watched movies yet.</p>
            ) : (
              watched.map((movie) => (
                <MovieCard key={movie.id} {...movieCardProps(movie)} />
              ))
            )}
          </div>
        </div>
      )}

      {showWatchlist && (
        <div style={{ padding: "0 20px 20px" }}>
          <h2 style={{ color: "white" }}>🔖 My Watchlist ({watchlist.length})</h2>
          <div className="movie-grid">
            {watchlist.length === 0 ? (
              <p style={{ color: "#aaa" }}>No movies added yet.</p>
            ) : (
              watchlist.map((movie) => (
                <MovieCard key={movie.id} {...movieCardProps(movie)} />
              ))
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="movie-grid" style={{ paddingTop: (searchQuery || selectedMood) ? "20px" : "0px" }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-box skeleton-img"></div>
              <div className="skeleton-box skeleton-text"></div>
              <div className="skeleton-box skeleton-text short"></div>
              <div className="skeleton-box skeleton-text date"></div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div style={styles.center}>
          <p style={styles.error}>⚠️ {error}</p>
        </div>
      )}

      {/* Dynamic Search / Mood Header (Moved out so it displays during loading) */}
      {(searchQuery || selectedMood) && (
        <div style={{ padding: "40px 20px 20px" }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: "32px", 
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: "2px",
            textTransform: "uppercase"
          }}>
            <span style={{ color: "white" }}>
              {searchQuery ? "Search Results: " : "Mood: "}
            </span>
            <span style={{ color: "#f5c518" }}>
              {searchQuery ? `"${searchQuery}"` : `${selectedMood.replace(/-/g, " ")}`}
            </span>
          </h2>
        </div>
      )}

      {!loading && !error && (
        <div>

          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movieCardProps(movie)} />
            ))}
          </div>
          <div className="load-more-container">
            <button style={styles.loadMoreBtn} onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" },
  error: { color: "#e50914", fontSize: "16px", background: "#1f1f1f", padding: "16px 24px", borderRadius: "8px", border: "1px solid #e50914" },
  loadMoreBtn: { padding: "12px 40px", borderRadius: "8px", border: "none", background: "#e50914", color: "white", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
};

function AppContent() {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [originalHero, setOriginalHero] = useState(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showWatched, setShowWatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "vote_average.desc",
    year: "",
    language: "",
    minRating: "",
    runtime: ""
  });

  const fetchWithFilters = async (genreId, filters, pageNum) => {
    if (genreId === "highest-rated") {
      return await discoverByMood("Highest-Rated", pageNum);
    } else if (genreId || filters.year || filters.language || filters.minRating || filters.runtime || filters.sortBy !== "vote_average.desc") {
      return await discoverMovies({ ...filters, genreId }, pageNum);
    } else {
      return await getPopularMovies(pageNum);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setActiveFilters(newFilters);
    setSelectedMood(null);
    setSearchQuery("");
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const results = await fetchWithFilters(selectedGenre, newFilters, 1);
      setMovies(results.filter(m => m.poster_path));
    } catch (error) {
      setError("Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadPopular = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await getPopularMovies(1);
        const filtered = results.filter(m => m.poster_path);
        setMovies(filtered);
        const hero = results.find(m => m.backdrop_path);
        setHeroMovie(hero);
        setOriginalHero(hero);
        setPage(1);
      } catch (error) {
        setError("Failed to load movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadPopular();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      let results;
      if (selectedMood) {
        results = await discoverByMood(selectedMood, nextPage);
      } else {
        results = await fetchWithFilters(selectedGenre, activeFilters, nextPage);
      }
      setMovies((prev) => [...prev, ...results.filter(m => m.poster_path)]);
      setPage(nextPage);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleGenreSelect = async (genreId) => {
    setSelectedGenre(genreId);
    setSelectedMood(null);
    setSearchQuery("");
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const results = await fetchWithFilters(genreId, activeFilters, 1);
      setMovies(results.filter(m => m.poster_path));
    } catch (error) {
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSelectedGenre(null);
    setSelectedMood(null);
    setSearchQuery(query);
    setPage(1);

    if (!query || query.trim() === "") {
      try {
        const results = await getPopularMovies(1);
        const filtered = results.filter(m => m.poster_path);
        setMovies(filtered);
        setHeroMovie(originalHero);
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const results = await searchMovies(query);
      const filtered = results.filter(m => m.poster_path);
      if (filtered.length === 0) {
        setError("No movies found. Try a different search.");
        setMovies([]);
        setHeroMovie(originalHero);
      } else {
        setMovies(filtered);
        setHeroMovie(filtered[0]);
      }
    } catch (error) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (mood) => {
    setLoading(true);
    setError(null);
    setSelectedGenre(null);
    setSelectedMood(mood);
    setSearchQuery("");
    setPage(1);
    try {
      const results = await discoverByMood(mood, 1);
      const filtered = results.filter(m => m.poster_path);
      if (filtered.length === 0) {
        setError(`No movies found for mood: ${mood}`);
        setMovies([]);
        setHeroMovie(originalHero);
      } else {
        setMovies(filtered);
        setHeroMovie(filtered[0]);
      }
    } catch (error) {
      setError("Failed to explore mood.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            movies={movies}
            heroMovie={heroMovie}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            showWatchlist={showWatchlist}
            setShowWatchlist={setShowWatchlist}
            showWatched={showWatched}
            setShowWatched={setShowWatched}
            handleSearch={handleSearch}
            genres={genres}
            selectedGenre={selectedGenre}
            handleGenreSelect={handleGenreSelect}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            handleMoodSelect={handleMoodSelect}
            handleLoadMore={handleLoadMore}
            searchQuery={searchQuery}
            selectedMood={selectedMood}
          />
        }
      />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;