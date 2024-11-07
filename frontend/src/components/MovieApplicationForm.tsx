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
import imageCompression from "browser-image-compression";

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
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "Image size cannot exceed 5MB",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateImage(file)) {
        return;
      }
      setSelectedFile(file);
      try {
        const compressedDataUrl = await compressImage(file);
        setFormData((prev) => ({
          ...prev,
          posterUrl: compressedDataUrl as string,
        }));
        generateThumbnail(file);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Image processing failed",
          severity: "error",
        });
      }
    }
  };

  const compressImage = async (imageFile: File) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.7,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error("Image compression failed:", error);
      setSnackbar({
        open: true,
        message: "Image compression failed, please try using a smaller image",
        severity: "error",
      });
      throw error;
    }
  };

  const generateThumbnail = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let posterUrl = formData.posterUrl;
      if (selectedFile) {
        posterUrl = (await compressImage(selectedFile)) as string;
      }
      await submitMovieApplication({
        ...formData,
        posterUrl,
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
      setPosterPreview(null);
      setThumbnail(null);
    } catch (error) {
      console.error("Error submitting application:", error);
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
        <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
          Upload Poster
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {thumbnail && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">Thumbnail Preview:</Typography>
            <Box
              component="img"
              src={thumbnail}
              alt="Thumbnail Preview"
              sx={{ width: "100%", minWidth: 100, height: "auto" }}
            />
          </Box>
        )}
        {posterPreview && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">Poster Preview:</Typography>
            <Box
              component="img"
              src={posterPreview}
              alt="Poster Preview"
              sx={{ width: "100%", minWidth: 100, height: "auto" }}
            />
          </Box>
        )}
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
