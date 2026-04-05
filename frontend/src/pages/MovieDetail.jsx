import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getSimilarMovies, getMovieVideos } from "../api";

import { useAuth } from "../context/AuthContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BACKEND_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/tmdb`
  : "http://localhost:5000/api/tmdb";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, watchlist, watched, toggleWatchlist, toggleWatched } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const inWatchlist = !!watchlist.find((m) => m.id === Number(id));
  const watchedEntry = watched.find((m) => m.id === Number(id));
  const isWatched = !!watchedEntry;

  const handleWatchlistClick = () => {
    if (!user) { alert("Please sign in to add to your watchlist!"); return; }
    toggleWatchlist(movie); // Syncs with backend automatically in AuthContext
  };

  const handleWatchedSubmit = () => {
    if (!user) { alert("Please sign in to log watched movies!"); return; }
    // If it's already watched, toggleWatched with 'null' rating will remove it
    toggleWatched(movie, isWatched ? null : selectedRating);
    setShowRatingPopup(false);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/movie/${id}`
        );
        setMovie(res.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilar = async () => {
      const results = await getSimilarMovies(id);
      setSimilar(results.slice(0, 7));
    };

    const fetchTrailer = async () => {
      const key = await getMovieVideos(id);
      setTrailerKey(key);
    };

    fetchMovie();
    fetchSimilar();
    fetchTrailer();
  }, [id]);

  if (loading) return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;
  if (!movie) return <p style={{ color: "white", padding: "40px" }}>Movie not found.</p>;

  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />

      {showTrailer && trailerKey && (
        <div style={styles.modalOverlay} onClick={() => setShowTrailer(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div style={{
        ...styles.backdrop,
        backgroundImage: movie.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
      }}>
        <div style={styles.backdropOverlay} />
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

        <div style={styles.main}>
          <img
            src={movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://dummyimage.com/300x450/1f1f1f/ffffff&text=No+Image"}
            alt={movie.title}
            style={styles.poster}
          />

          <div style={styles.info}>
            <h1 style={styles.title}>{movie.title}</h1>
            <p style={styles.tagline}>{movie.tagline}</p>

            <div style={styles.meta}>
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>📅 {movie.release_date}</span>
              <span>⏱ {movie.runtime} min</span>
            </div>

            <div style={styles.genres}>
              {movie.genres?.map((g) => (
                <span key={g.id} style={styles.genre}>{g.name}</span>
              ))}
            </div>

            <p style={styles.overview}>{movie.overview}</p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <button
                style={{ ...styles.actionBtn, background: inWatchlist ? "#f5c518" : "rgba(255,255,255,0.1)", color: inWatchlist ? "#000" : "white", border: inWatchlist ? "none" : "1px solid white", backdropFilter: "blur(4px)" }}
                onClick={handleWatchlistClick}
              >
                {inWatchlist ? "★ In Watchlist" : "☆ Add to Watchlist"}
              </button>

              <button
                style={{ ...styles.actionBtn, background: isWatched ? "#4caf50" : "rgba(255,255,255,0.1)", color: "white", border: isWatched ? "none" : "1px solid white", backdropFilter: "blur(4px)" }}
                onClick={() => isWatched ? handleWatchedSubmit() : setShowRatingPopup(true)}
              >
                {isWatched ? `✓ Watched (${watchedEntry.userRating}/10)` : "○ Mark as Watched"}
              </button>

              {trailerKey && (
                <button
                  style={{ ...styles.actionBtn, background: "#e50914", color: "white", border: "none" }}
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Play Trailer
                </button>
              )}
            </div>

            {showRatingPopup && (
              <div style={styles.ratingPopup}>
                <p style={{ color: "white", marginBottom: "10px", fontWeight: "bold" }}>Rate this movie</p>
                <select
                  style={styles.select}
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} ⭐</option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button style={styles.confirmBtn} onClick={handleWatchedSubmit}>Done</button>
                  <button style={styles.cancelBtn} onClick={() => setShowRatingPopup(false)}>Cancel</button>
                </div>
              </div>
            )}

            {cast.length > 0 && (
              <>
                <h3 style={{ color: "white", marginBottom: "10px" }}>Top Cast</h3>
                <div style={styles.cast}>
                  {cast.map((c) => (
                    <div key={c.id} style={styles.castCard}>
                      <img
                        src={c.profile_path
                          ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                          : "https://dummyimage.com/80x80/333/fff&text=?"}
                        alt={c.name}
                        style={styles.castImg}
                      />
                      <p style={styles.castName}>{c.name}</p>
                      <p style={styles.castChar}>{c.character}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div style={styles.similarSection}>
            <h2 style={styles.similarTitle}>
              <span style={{ color: "white" }}>SIMILAR </span>
              <span style={{ color: "#f5c518" }}>MOVIES</span>
            </h2>
            <div style={styles.similarGrid}>
              {similar.map((m) => (
                <div
                  key={m.id}
                  style={styles.similarCard}
                  onClick={() => navigate(`/movie/${m.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    style={styles.similarImg}
                  />
                  <p style={styles.similarMovieTitle}>{m.title}</p>
                  <p style={styles.similarRating}>⭐ {m.vote_average?.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#111", position: "relative", overflowX: "hidden" },
  backdrop: { 
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundSize: "cover", backgroundPosition: "top 20% center", backgroundAttachment: "fixed" 
  },
  backdropOverlay: { 
    position: "absolute", inset: 0, 
    background: "linear-gradient(to right, #111 15%, rgba(17,17,17,0.9) 45%, rgba(17,17,17,0.3) 100%), linear-gradient(to top, #111 0%, transparent 15%)" 
  },
  content: { position: "relative", zIndex: 1, padding: "100px 5% 40px", minHeight: "100vh", display: "flex", flexDirection: "column" },
  backBtn: { background: "transparent", border: "1px solid #aaa", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginBottom: "20px", fontSize: "14px", alignSelf: "flex-start" },
  main: { display: "flex", gap: "40px", flexWrap: "wrap" },
  poster: { width: "250px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.6)", alignSelf: "center" },
  info: { flex: 1, minWidth: "280px" },
  title: { color: "white", fontSize: "32px", margin: "0 0 8px" },
  tagline: { color: "#aaa", fontStyle: "italic", marginBottom: "16px" },
  meta: { display: "flex", gap: "20px", color: "#f5c518", marginBottom: "16px", flexWrap: "wrap" },
  genres: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  genre: { background: "#e50914", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" },
  overview: { color: "#ccc", lineHeight: "1.8", fontSize: "15px", marginBottom: "24px" },
  actionBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
  ratingPopup: { background: "#1a1a2e", border: "1px solid #f5c518", borderRadius: "10px", padding: "20px", marginBottom: "20px", maxWidth: "200px" },
  select: { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#2a2a2a", color: "white", fontSize: "14px" },
  confirmBtn: { padding: "8px 16px", borderRadius: "6px", border: "none", background: "#4caf50", color: "white", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { padding: "8px 16px", borderRadius: "6px", border: "none", background: "#555", color: "white", cursor: "pointer" },
  cast: { display: "flex", gap: "12px", flexWrap: "wrap" },
  castCard: { textAlign: "center", width: "80px" },
  castImg: { width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" },
  castName: { color: "white", fontSize: "11px", margin: "6px 0 2px" },
  castChar: { color: "#aaa", fontSize: "10px", margin: 0 },
  similarSection: { marginTop: "60px" },
  similarTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: "28px", letterSpacing: "3px", marginBottom: "20px" },
  similarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "16px" },
  similarCard: { cursor: "pointer", borderRadius: "8px", overflow: "hidden", background: "#1f1f1f" },
  similarImg: { width: "100%", height: "200px", objectFit: "cover", display: "block" },
  similarMovieTitle: { color: "white", fontSize: "11px", padding: "6px 8px 2px", margin: 0, textAlign: "center" },
  similarRating: { color: "#f5c518", fontSize: "11px", textAlign: "center", margin: "0 0 8px" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modalContent: { position: "relative", width: "80%", height: "70vh", background: "#000", borderRadius: "12px", overflow: "visible" },
  closeBtn: { position: "absolute", top: "-40px", right: "0px", background: "transparent", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "0", cursor: "pointer", fontSize: "20px", zIndex: 10, fontWeight: "bold" },
};

export default MovieDetail;