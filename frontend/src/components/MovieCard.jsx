import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ id, title, rating, image, overview, onAddToWatchlist, inWatchlist, releaseDate, onMarkWatched, isWatched, watchedRating }) {
  const [hovered, setHovered] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const navigate = useNavigate();

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    if (isWatched) {
      onMarkWatched(null);
    } else {
      setShowRatingPopup(true);
    }
  };

  const handleRatingSubmit = (e) => {
    e.stopPropagation();
    onMarkWatched(selectedRating);
    setShowRatingPopup(false);
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/movie/${id}`)}
    >
      <img src={image} alt={title} style={styles.image} />

      <button
        style={{ ...styles.iconBtn, color: inWatchlist ? "#f5c518" : "white", right: "44px" }}
        onClick={(e) => { e.stopPropagation(); onAddToWatchlist(); }}
        title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      >
        {inWatchlist ? "★" : "☆"}
      </button>

      <button
        style={{ ...styles.iconBtn, color: isWatched ? "#4caf50" : "white", right: "8px" }}
        onClick={handleWatchedClick}
        title={isWatched ? "Remove from Watched" : "Mark as Watched"}
      >
        {isWatched ? "✓" : "○"}
      </button>

      {showRatingPopup && (
        <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
          <p style={{ color: "white", fontSize: "12px", marginBottom: "8px", fontWeight: "bold" }}>Rate this movie</p>
          <select
            style={styles.select}
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <button style={styles.confirmBtn} onClick={handleRatingSubmit}>Done</button>
            <button style={styles.cancelBtn} onClick={(e) => { e.stopPropagation(); setShowRatingPopup(false); }}>✕</button>
          </div>
        </div>
      )}

      {hovered && !showRatingPopup && (
        <div style={styles.overlay}>
          <p style={styles.overviewText}>{overview || "No description available."}</p>
        </div>
      )}

      <h3 style={styles.title}>{title}</h3>
      <p style={{ color: "#f5c518", margin: "4px 0", fontSize: "13px" }}>⭐ {rating?.toFixed(1)}</p>
      {isWatched && watchedRating && (
        <p style={{ color: "#4caf50", fontSize: "12px", margin: "2px 0" }}>✓ Your rating: {watchedRating}/10</p>
      )}
      <p style={{ color: "#aaa", fontSize: "12px", margin: "4px 8px 10px" }}>📅 {releaseDate || "N/A"}</p>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    borderRadius: "10px",
    background: "#1f1f1f",
    color: "white",
    textAlign: "center",
    position: "relative",
    cursor: "pointer",
    paddingBottom: "10px",
  },
  image: { width: "100%", display: "block", borderRadius: "10px 10px 0 0" },
  iconBtn: {
    position: "absolute",
    top: "8px",
    background: "rgba(0,0,0,0.5)",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "68%",
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    boxSizing: "border-box",
    borderRadius: "10px 10px 0 0",
  },
  overviewText: { fontSize: "12px", color: "white", lineHeight: "1.6", margin: 0 },
  title: { fontSize: "13px", padding: "8px 8px 2px", margin: 0 },
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#1a1a2e",
    border: "1px solid #f5c518",
    borderRadius: "10px",
    padding: "14px",
    zIndex: 20,
    width: "140px",
    textAlign: "center",
  },
  select: {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#2a2a2a",
    color: "white",
    fontSize: "13px",
  },
  confirmBtn: {
    flex: 1,
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    background: "#4caf50",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#555",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default MovieCard;