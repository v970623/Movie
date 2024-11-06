import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Container,
  CardActions,
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
    <Box
      sx={{ p: 4, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: "primary.main" }}>
          Featured Movies
        </Typography>
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="360"
                  image={movie.posterUrl}
                  alt={movie.title}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {movie.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ fontWeight: 600 }}
                  >
                    ${movie.price}/day
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/movies/${movie._id}`)}
                    sx={{
                      textTransform: "none",
                      py: 1,
                      fontWeight: 500,
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieList;
