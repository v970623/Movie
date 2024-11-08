import React, { useState } from "react";
import { movieAPI } from "../api/api";

interface MovieData {
  title: string;
  release_date: string;
  overview: string;
}

function MovieSearch() {
  const [title, setTitle] = useState<string>("");
  const [movies, setMovies] = useState<MovieData[]>([]);

  const handleSearch = async () => {
    try {
      const response = await movieAPI.searchMovie(title);
      console.log("Fetched movies:", response);
      setMovies(response);
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

      {movies.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Date</th>
              <th>Overview</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={index}>
                <td>{movie.title}</td>
                <td>{movie.release_date}</td>
                <td>{movie.overview}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MovieSearch;
