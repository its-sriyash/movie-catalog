import { useNavigate } from "react-router-dom";

function HeroSection({ movie }) {
  const navigate = useNavigate();
  if (!movie) return null;

  return (
    <div style={{
      ...styles.hero,
      backgroundImage: movie.backdrop_path
        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        : "none",
    }}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <div style={styles.trendingBadge}>
            <span style={styles.dot}></span>
            <span style={styles.dot}></span>
            NOW TRENDING
          </div>

          <h1 style={styles.title}>
            {movie.title?.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={styles.titleLastWord}>
              {movie.title?.split(" ").slice(-1)[0]}
            </span>
          </h1>

          <div style={styles.meta}>
            <span style={styles.rating}>★ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.genres?.slice(0, 2).map(g => g.name).join(" · ")}</span>
          </div>

          <p style={styles.overview}>
            {movie.overview?.slice(0, 200)}
            {movie.overview?.length > 200 ? "..." : ""}
          </p>

          <button
            style={styles.moreInfoBtn}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
           More Info
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
hero: {
    width: "100%",
    height: "580px",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.3) 100%), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "50px 40px",
  },
  content: {
    maxWidth: "500px",
  },
  trendingBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #f5c518",
    color: "#f5c518",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "2px",
    padding: "6px 12px",
    borderRadius: "4px",
    marginBottom: "16px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#e50914",
    display: "inline-block",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontSize: "52px",
    color: "white",
    fontWeight: "700",
    lineHeight: "1.1",
    marginBottom: "12px",
  },
  titleLastWord: {
    color: "#f5c518",
  },
  meta: {
    display: "flex",
    gap: "16px",
    color: "#ccc",
    fontSize: "13px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  rating: {
    color: "#f5c518",
    fontWeight: "bold",
  },
  overview: {
    color: "#bbb",
    fontSize: "14px",
    lineHeight: "1.7",
    maxWidth: "420px",
    marginBottom: "24px",
  },
  moreInfoBtn: {
    padding: "12px 28px",
    borderRadius: "8px",
    border: "1px solid white",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    fontWeight: "bold",
  },
};

export default HeroSection;