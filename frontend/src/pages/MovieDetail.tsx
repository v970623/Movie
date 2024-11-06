import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: "0 0 300px" }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            ${movie.price}/day
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenRental(true)}
            disabled={movie.status !== "available"}
          >
            Rent Now
          </Button>
        </Box>
      </Box>

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
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetail;
