import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const API_BASE_URL = "http://localhost:5001/api/movies";

import { IMovie } from "../types/movie";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = React.useState<IMovie | null>(null);
  const [openRental, setOpenRental] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        setMovie(data.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  const handleRentalSubmit = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/rentals", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          movieId: id,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        setOpenRental(false);
        window.alert("Rental submitted successfully!");
      }
    } catch (error) {
      console.error("Failed to submit rental:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.posterUrl}
              alt={movie.title}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom color="primary.main">
              {movie.title}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {movie.description}
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ fontWeight: 600 }}
              >
                ${movie.price}
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  /day
                </Typography>
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenRental(true)}
              disabled={movie.status !== "available"}
              sx={{
                textTransform: "none",
                py: 1.5,
                px: 4,
                fontWeight: 500,
                borderRadius: 2,
                pointerEvents: movie.status !== "available" ? "none" : "auto",
              }}
            >
              {movie.status === "available"
                ? "Rent Now"
                : "Currently Unavailable"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openRental} onClose={() => setOpenRental(false)}>
        <DialogTitle>Rent Movie</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRental(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRentalSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MovieDetail;
