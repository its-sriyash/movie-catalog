// FilterControls.jsx
function FilterControls({ activeFilters, onFilterChange, disabled }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...activeFilters, [name]: value });
  };

  return (
    <div style={styles.container}>
      {/* Sort By */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Sort By:</label>
        <select name="sortBy" value={activeFilters.sortBy} onChange={handleChange} disabled={disabled} style={styles.select}>
          <option value="vote_average.desc">Rating (High to Low)</option>
          <option value="primary_release_date.desc">Newest First</option>
          <option value="primary_release_date.asc">Oldest First</option>
        </select>
      </div>

      {/* Year */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Year:</label>
        <select name="year" value={activeFilters.year} onChange={handleChange} disabled={disabled} style={styles.select}>
          <option value="">All Years</option>
          {Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Language:</label>
        <select name="language" value={activeFilters.language} onChange={handleChange} disabled={disabled} style={styles.select}>
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="de">German</option>
        </select>
      </div>

      {/* Minimum Rating */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Min Rating:</label>
        <select name="minRating" value={activeFilters.minRating} onChange={handleChange} disabled={disabled} style={styles.select}>
          <option value="">Any</option>
          <option value="9">9+ ⭐</option>
          <option value="8">8+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="6">6+ ⭐</option>
          <option value="5">5+ ⭐</option>
        </select>
      </div>

      {/* Runtime */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Runtime:</label>
        <select name="runtime" value={activeFilters.runtime} onChange={handleChange} disabled={disabled} style={styles.select}>
          <option value="">Any Runtime</option>
          <option value="short">Under 90 mins</option>
          <option value="medium">90 - 120 mins</option>
          <option value="long">Over 120 mins</option>
        </select>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "16px",
    padding: "0 20px 20px",
    flexWrap: "wrap",
    borderBottom: "1px solid #333",
    marginBottom: "20px"
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    color: "#aaa",
    fontSize: "13px",
    fontWeight: "600",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    background: "#2a2a2a",
    color: "white",
    border: "1px solid #444",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  }
};

export default FilterControls;
