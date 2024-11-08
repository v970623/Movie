import React, { useState } from "react";
import { movieAPI } from "../api/api";

interface MovieData {
  title: string;
  release_date: string;
  overview: string;
}

function MovieSearch() {
  const [title, setTitle] = useState<string>("");
  const [movieData, setMovieData] = useState<MovieData | null>(null);

  const handleSearch = async () => {
    try {
      const response = await movieAPI.getMovieData({ query: { title } }, {});
      setMovieData(response.data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {movieData && (
        <div>
          <h2>{movieData.title}</h2>
          <p>Release Date: {movieData.release_date}</p>
          <p>Overview: {movieData.overview}</p>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
