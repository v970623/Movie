import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { IMovie } from "../../types/movie";
import {
  createMovie,
  updateMovieStatus,
  getMovies,
  deleteMovie,
} from "../../api/movieApi";
import AddIcon from "@mui/icons-material/Add";

const MovieManagement: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [newMovie, setNewMovie] = useState<Partial<IMovie>>({
    title: "",
    description: "",
    genre: [],
    posterUrl: "",
    price: 0,
    status: "available",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getMovies();
      console.log("Movies response:", response);
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data.movies)
      ) {
        setMovies(response.data.data.movies);
      } else {
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      await createMovie(newMovie as IMovie);
      setSnackbar({
        open: true,
        message: "Movie created successfully",
        severity: "success",
      });
      setOpenDialog(false);
      fetchMovies();
      setNewMovie({
        title: "",
        description: "",
        genre: [],
        posterUrl: "",
        price: 0,
        status: "available",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create movie",
        severity: "error",
      });
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newMovie.title?.trim()) {
      errors.title = "Title is required";
    }
    if (!newMovie.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!newMovie.price || newMovie.price <= 0) {
      errors.price = "Valid price is required";
    }
    if (!newMovie.posterUrl?.trim()) {
      errors.posterUrl = "Poster URL is required";
    }
    if (!newMovie.genre?.length) {
      errors.genre = "At least one genre is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              Movie Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddIcon />}
              sx={{ textTransform: "none" }}
            >
              Add New Movie
            </Button>
          </Box>

          <Grid container spacing={3}>
            {!Array.isArray(movies) ? (
              <Grid item xs={12}>
                <Typography color="error">
                  No movies available or invalid data format
                </Typography>
              </Grid>
            ) : movies.length === 0 ? (
              <Grid item xs={12}>
                <Typography>No movies found</Typography>
              </Grid>
            ) : (
              movies.map((movie) => (
                <Grid item xs={12} md={6} key={movie._id}>
                  <Card
                    elevation={0}
                    sx={{
                      display: "flex",
                      height: "100%",
                      borderRadius: 2,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 140 }}
                      image={movie.posterUrl}
                      alt={movie.title}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <CardContent sx={{ flex: "1 0 auto", p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {movie.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {movie.description}
                        </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                          {movie.genre.map((genre) => (
                            <Chip
                              key={genre}
                              label={genre}
                              size="small"
                              sx={{
                                mr: 0.5,
                                mb: 0.5,
                                bgcolor: "primary.light",
                                color: "primary.main",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="h6" color="primary.main">
                          ${movie.price}/day
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions
                        sx={{ p: 2, justifyContent: "space-between" }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleUpdateMovie(
                              movie._id,
                              movie.status === "available"
                                ? "unavailable"
                                : "available"
                            )
                          }
                          sx={{ textTransform: "none" }}
                        >
                          {movie.status === "available"
                            ? "Mark Unavailable"
                            : "Mark Available"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteMovie(movie._id)}
                          sx={{ textTransform: "none" }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Title"
                    value={newMovie.title}
                    onChange={(e) =>
                      setNewMovie({ ...newMovie, title: e.target.value })
                    }
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price"
                    type="number"
                    value={newMovie.price}
                    onChange={(e) =>
                      setNewMovie({
                        ...newMovie,
                        price: parseFloat(e.target.value),
                      })
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={newMovie.description}
                    onChange={(e) =>
                      setNewMovie({ ...newMovie, description: e.target.value })
                    }
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Genre (comma separated)"
                    value={newMovie.genre?.join(", ")}
                    onChange={(e) =>
                      setNewMovie({
                        ...newMovie,
                        genre: e.target.value.split(", "),
                      })
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Poster URL"
                    value={newMovie.posterUrl}
                    onChange={(e) =>
                      setNewMovie({ ...newMovie, posterUrl: e.target.value })
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCreateMovie();
                  setOpenDialog(false);
                }}
              >
                Add Movie
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default MovieManagement;