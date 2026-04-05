import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPopularMovies } from "../api";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Movie slideshow state
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Fetch popular movies for the slideshow
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const results = await getPopularMovies(1);
        const withBackdrop = results.filter((m) => m.backdrop_path && m.poster_path);
        setMovies(withBackdrop.slice(0, 10));
      } catch (err) {
        console.error("Failed to load slideshow movies:", err);
      }
    };
    loadMovies();
  }, []);

  // Rotate movies every 3 seconds with fade transition
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [movies]);

  const currentMovie = movies[currentIndex];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) {
          setError("Username is required");
          setLoading(false);
          return;
        }
        await register(username, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@1,700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.page}>
        {/* Left side — Auth form */}
        <div style={styles.formSide}>
          <div style={styles.card}>
            <div style={styles.logoContainer}>
              <span style={styles.logoItalic}>Cine</span>
              <span style={styles.logoGold}>SCOPE</span>
            </div>

            <h2 style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p style={styles.subtitle}>
              {isLogin
                ? "Sign in to access your watchlist & ratings"
                : "Join CineScope to save movies & rate them"}
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                minLength={6}
              />
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <p style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                style={styles.switchLink}
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </div>

        {/* Right side — Movie slideshow */}
        <div style={styles.slideshowSide}>
          {currentMovie && (
            <div
              style={{
                ...styles.slideshowContainer,
                opacity: fade ? 1 : 0,
                transition: "opacity 0.4s ease-in-out",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`}
                alt={currentMovie.title}
                style={styles.backdropImage}
              />
              <div style={styles.slideshowOverlay}>
                <div style={styles.movieInfo}>
                  <p style={styles.nowShowing}>🎬 Now Showing</p>
                  <h2 style={styles.movieTitle}>{currentMovie.title}</h2>
                  <div style={styles.movieMeta}>
                    <span style={styles.movieRating}>
                      ⭐ {currentMovie.vote_average?.toFixed(1)}
                    </span>
                    <span style={styles.movieDate}>
                      📅 {currentMovie.release_date?.slice(0, 4)}
                    </span>
                  </div>
                  <p style={styles.movieOverview}>
                    {currentMovie.overview?.slice(0, 150)}
                    {currentMovie.overview?.length > 150 ? "..." : ""}
                  </p>
                </div>

                {/* Progress dots */}
                <div style={styles.dots}>
                  {movies.map((_, i) => (
                    <span
                      key={i}
                      style={{
                        ...styles.dot,
                        background: i === currentIndex ? "#f5c518" : "rgba(255,255,255,0.3)",
                        width: i === currentIndex ? "24px" : "8px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0f2c",
    display: "flex",
  },
  formSide: {
    width: "420px",
    minWidth: "380px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 30px",
    background: "rgba(17, 24, 39, 0.98)",
    borderRight: "1px solid rgba(245, 197, 24, 0.1)",
  },
  card: {
    width: "100%",
    maxWidth: "340px",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "28px",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "2px",
  },
  logoItalic: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "36px",
    color: "white",
  },
  logoGold: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: "38px",
    color: "#f5c518",
    letterSpacing: "3px",
  },
  title: {
    color: "white",
    fontSize: "24px",
    textAlign: "center",
    margin: "0 0 8px",
    fontWeight: 600,
  },
  subtitle: {
    color: "#8899aa",
    fontSize: "14px",
    textAlign: "center",
    margin: "0 0 24px",
  },
  error: {
    background: "rgba(229, 9, 20, 0.15)",
    border: "1px solid #e50914",
    color: "#ff6b6b",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #2a3050",
    background: "#0d1222",
    color: "white",
    fontSize: "15px",
    outline: "none",
  },
  submitBtn: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #e50914, #ff4a4a)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  switchText: {
    color: "#8899aa",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "20px",
  },
  switchLink: {
    color: "#f5c518",
    cursor: "pointer",
    fontWeight: "bold",
  },
  // Right side slideshow
  slideshowSide: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  slideshowContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  slideshowOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(17,24,39,0.95) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4) 100%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "40px",
  },
  movieInfo: {
    maxWidth: "500px",
  },
  nowShowing: {
    color: "#f5c518",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  movieTitle: {
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 12px",
    lineHeight: 1.2,
  },
  movieMeta: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
  },
  movieRating: {
    color: "#f5c518",
    fontSize: "15px",
    fontWeight: "bold",
  },
  movieDate: {
    color: "#aaa",
    fontSize: "15px",
  },
  movieOverview: {
    color: "#ccc",
    fontSize: "14px",
    lineHeight: 1.7,
    margin: "0 0 24px",
  },
  dots: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  dot: {
    height: "8px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
  },
};

export default AuthPage;
