import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Home, User as UserIcon, LogOut, CheckSquare, Bookmark, Play, ChevronDown } from "lucide-react";

function Navbar({ onSearch, onMoodSelect, watchlistCount, onWatchlistClick, watchedCount, onWatchedClick }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onSearch(query);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onSearch(val);
    }, 500);
  };

  const handleNavHome = () => {
    setQuery("");
    onSearch("");
    navigate("/");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@1,700&display=swap"
        rel="stylesheet"
      />

      <nav style={styles.nav}>
        {/* Left: Logo */}
        <div style={styles.leftNav}>
          <div style={styles.logoContainer} onClick={handleNavHome}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "28px",
                color: "white",
              }}
            >
              Cine
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "30px",
                color: "#f5c518",
                letterSpacing: "3px",
              }}
            >
              SCOPE
            </span>
          </div>

          <div style={styles.navItem} onClick={handleNavHome}>
            <Home size={18} />
            <span style={styles.navText}>Home</span>
          </div>
        </div>

        {/* Center: Search Box -> Long and Symmetric */}
        <div style={styles.centerNav}>
          <div style={styles.searchContainer}>
            <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%", height: "100%" }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={handleInputChange}
              />
              <button type="submit" style={styles.searchBtn}>
                <Search size={20} color="rgba(255,255,255,0.7)" />
              </button>
            </form>
          </div>
        </div>

        {/* Right side navigation items */}
        <div style={styles.rightNav}>

          {/* CineMood Dropdown */}
          <div 
            style={{ position: "relative", paddingBottom: "30px", marginBottom: "-30px", zIndex: 10 }}
            onMouseEnter={() => setShowMoodDropdown(true)}
            onMouseLeave={() => setShowMoodDropdown(false)}
          >
            <div style={styles.navItem}>
              <span style={{ ...styles.navText, color: "#fefdfbff", fontWeight: 600 }}>CineMood</span>
              <ChevronDown size={16} color="#fefdfcff" />
            </div>

            {showMoodDropdown && (
              <div style={{ 
                ...styles.dropdown, 
                top: "35px", 
                width: "400px", 
                maxHeight: "350px", 
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "4px",
                padding: "8px"
              }}>
                {[
                  { label: "Neo-Noir", query: "Neo-Noir" },
                  { label: "Coming-of-Age", query: "Coming of Age" },
                  { label: "Psycho-Thriller", query: "Psychological Thriller" },
                  { label: "Sci-Fi Dystopian", query: "Dystopian" },
                  { label: "Dark Comedy", query: "Dark Comedy" },
                  { label: "Crime Drama", query: "Crime Drama" },
                  { label: "Fast-Paced", query: "Fast-Paced" },
                  { label: "Midnight Watch", query: "Midnight Watch" },
                  { label: "Slow Cinema", query: "Slow Cinema" },
                  { label: "Feel-Good", query: "Feel-Good" },
                  { label: "Slice of Life", query: "Slice of Life" },
                  { label: "Epic Historical", query: "Epic Historical" },
                  { label: "Tragedy / Drama", query: "Tragedy" },
                  { label: "Anime", query: "Anime" },
                ].map((mood) => (
                  <button
                    key={mood.label}
                    className="dropdown-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(""); 
                      onMoodSelect(mood.query);
                      setShowMoodDropdown(false);
                    }}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && (
            <>
              <div style={styles.navItem} onClick={onWatchedClick}>
                <CheckSquare size={18} />
                <span style={styles.navText}>Watched</span>
                {watchedCount > 0 && <span style={styles.badge}>{watchedCount}</span>}
              </div>

              <div style={styles.navItem} onClick={onWatchlistClick}>
                <Bookmark size={18} />
                <span style={styles.navText}>Watchlist</span>
                {watchlistCount > 0 && <span style={styles.badge}>{watchlistCount}</span>}
              </div>
            </>
          )}

          <div style={styles.userContainer}>
            <button
              style={styles.userBtn}
              onClick={() => {
                if (user) {
                  setShowDropdown(!showDropdown);
                } else {
                  navigate("/auth");
                }
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            >
              <UserIcon size={24} color="white" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && user && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  👋 {user.username}
                </div>
                <button
                  className="dropdown-btn"
                  style={{ color: "#ff4a4a" }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    logout();
                    navigate("/");
                    setShowDropdown(false);
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 40px",
    background: "transparent",
    position: "absolute", // Makes it overlay the hero image like the screenshot
    top: 0,
    zIndex: 100,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  leftNav: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    flex: 1, // takes up left side
  },
  logoContainer: {
    cursor: "pointer",
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
  },
  logoIconBg: {
    background: "#e50914",
    borderRadius: "8px",
    padding: "6px 8px 6px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif", // Keeping original CineScope vibe
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "26px",
    color: "white",
    letterSpacing: "0.5px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    transition: "opacity 0.2s",
  },
  navText: {
    opacity: 0.9,
  },
  centerNav: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // takes up middle space completely
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    width: "500px", // Long search box
    height: "44px", // Fixed height for absolute symmetry
    position: "relative",
  },
  input: {
    width: "100%",
    height: "100%",
    padding: "0 50px 0 20px", // left padding 20, right padding 50 for the icon
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontSize: "15px",
    outline: "none",
    backdropFilter: "blur(8px)",
    transition: "background 0.3s, border-color 0.3s",
    boxSizing: "border-box",
  },
  searchBtn: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)", // Perfect vertical centering
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: "100%", // allows clicking entire right edge
  },
  rightNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "24px",
    flex: 1, // keeps right side balanced
  },
  userContainer: {
    position: "relative",
  },
  userBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: "50%",
    transition: "background 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    background: "rgba(27, 37, 48, 0.65)", // Semi-transparent Prime dark bg
    backdropFilter: "blur(16px)", // Smooth frosted glass blur
    WebkitBackdropFilter: "blur(16px)", // Safari support
    border: "1px solid rgba(255, 255, 255, 0.1)", // Very subtle light border
    borderRadius: "12px", // Slightly smoother corners
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxHeight: "400px",
  },
  dropdownHeader: {
    padding: "12px 16px",
    color: "#aaa",
    fontSize: "13px",
    borderBottom: "1px solid #333",
    background: "#111",
  },
  divider: {
    height: "1px",
    background: "#333",
    margin: "4px 0",
  },
  badge: {
    background: "#e50914",
    borderRadius: "10px",
    padding: "2px 6px",
    fontSize: "11px",
    marginLeft: "auto",
    fontWeight: "bold",
  },
};

export default Navbar;