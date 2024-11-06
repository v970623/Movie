import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/movies";

import { IMovie } from "../types/movie";

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const navigate = useNavigate();

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
    <Grid container spacing={3} sx={{ p: 3 }}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie._id}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={movie.posterUrl}
              alt={movie.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                ${movie.price}/day
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate(`/movies/${movie._id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
