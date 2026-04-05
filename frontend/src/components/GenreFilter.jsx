function GenreFilter({ genres, selectedGenre, onSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>
          <span style={{ color: "white" }}>BROWSE </span>
          <span style={{ color: "#f5c518" }}>COLLECTION</span>
        </h2>
      </div>

      <div style={styles.btnRow}>
        <button
          style={{
            ...styles.btn,
            background: selectedGenre === null ? "#f5c518" : "transparent",
            color: selectedGenre === null ? "#000" : "#aaa",
            borderColor: selectedGenre === null ? "#f5c518" : "#444",
          }}
          onClick={() => onSelect(null)}
        >
          ALL
        </button>
        <button
          style={{
            ...styles.btn,
            background: selectedGenre === "highest-rated" ? "#f5c518" : "transparent",
            color: selectedGenre === "highest-rated" ? "#000" : "#aaa",
            borderColor: selectedGenre === "highest-rated" ? "#f5c518" : "#444",
          }}
          onClick={() => onSelect("highest-rated")}
        >
          HIGHEST-RATED
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            style={{
              ...styles.btn,
              background: selectedGenre === genre.id ? "#f5c518" : "transparent",
              color: selectedGenre === genre.id ? "#000" : "#aaa",
              borderColor: selectedGenre === genre.id ? "#f5c518" : "#444",
            }}
            onClick={() => onSelect(genre.id)}
          >
            {genre.name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px 20px 16px",
  },
  header: {
    marginBottom: "16px",
  },
  heading: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: "28px",
    letterSpacing: "3px",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  btn: {
    padding: "8px 18px",
    borderRadius: "4px",
    border: "1px solid #444",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
    cursor: "pointer",
  },
};

export default GenreFilter;