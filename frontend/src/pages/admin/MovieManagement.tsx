import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { IMovie } from "../../types/movie";
import {
  createMovie,
  updateMovieStatus,
  getMovies,
  deleteMovie,
} from "../../api/movieApi";

const MovieManagement: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [newMovie, setNewMovie] = useState<Partial<IMovie>>({
    title: "",
    description: "",
    genre: [],
    posterUrl: "",
    price: 0,
    status: "available",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(response.data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  const handleCreateMovie = async () => {
    try {
      if (!newMovie.price) {
        console.error("Price is required");
        return;
      }
      await createMovie(newMovie as IMovie);
      fetchMovies();
    } catch (error) {
      console.error("Failed to create movie:", error);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(movieId);
        fetchMovies();
      } catch (error) {
        console.error("Failed to delete movie:", error);
      }
    }
  };

  const handleUpdateMovie = async (movieId: string, status: string) => {
    try {
      await updateMovieStatus(movieId, status);
      fetchMovies();
    } catch (error) {
      console.error("Failed to update movie:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Movie Management
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Add New Movie</Typography>
        <TextField
          label="Title"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newMovie.description}
          onChange={(e) =>
            setNewMovie({ ...newMovie, description: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Genre"
          value={newMovie.genre?.join(", ")}
          onChange={(e) =>
            setNewMovie({ ...newMovie, genre: e.target.value.split(", ") })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Poster URL"
          value={newMovie.posterUrl}
          onChange={(e) =>
            setNewMovie({ ...newMovie, posterUrl: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={newMovie.price}
          onChange={(e) =>
            setNewMovie({ ...newMovie, price: parseFloat(e.target.value) })
          }
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleCreateMovie}>
          Add Movie
        </Button>
      </Paper>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} md={6} key={movie._id}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2">{movie.description}</Typography>
              <Typography variant="body2">
                Genre: {movie.genre.join(", ")}
              </Typography>
              <Typography variant="body2">Price: ${movie.price}</Typography>
              <Button
                variant="outlined"
                onClick={() =>
                  handleUpdateMovie(
                    movie._id,
                    movie.status === "available" ? "unavailable" : "available"
                  )
                }
              >
                {movie.status === "available"
                  ? "Mark Unavailable"
                  : "Mark Available"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteMovie(movie._id)}
                sx={{ ml: 2 }}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieManagement;
