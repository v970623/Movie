import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import MovieCard from "../components/MovieCard";
import { IMovie } from "../types/movie";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/movies";

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(response.data.data.movies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {movies.map((movie) => (
        <Col key={movie._id} xs={24} sm={12} md={8} lg={6}>
          <MovieCard movie={movie} onRefresh={fetchMovies} />
        </Col>
      ))}
    </Row>
  );
};

export default MovieList;
