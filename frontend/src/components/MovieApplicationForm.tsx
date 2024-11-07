import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { submitMovieApplication } from "../api/movieApplicationApi";

const MovieApplicationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    actorsOrDirectors: "",
    posterUrl: "",
    price: "",
    genre: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMovieApplication({
        ...formData,
        price: Number(formData.price),
        genre: formData.genre.split(",").map((g) => g.trim()),
      });
      setSnackbar({
        open: true,
        message: "Application submitted successfully",
        severity: "success",
      });
      setFormData({
        title: "",
        actorsOrDirectors: "",
        posterUrl: "",
        price: "",
        genre: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to submit application",
        severity: "error",
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Submit New Movie Application
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Movie Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Actors Or Directors"
          value={formData.actorsOrDirectors}
          onChange={(e) =>
            setFormData({ ...formData, actorsOrDirectors: e.target.value })
          }
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="Poster URL"
          value={formData.posterUrl}
          onChange={(e) =>
            setFormData({ ...formData, posterUrl: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Genre (comma separated)"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          margin="normal"
          required
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Submit Application
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default MovieApplicationForm;
