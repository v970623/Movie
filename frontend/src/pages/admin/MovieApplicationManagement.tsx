import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import {
  getMovieApplications,
  updateApplicationStatus,
} from "../../api/movieApplicationApi";
import { createMovie } from "../../api/movieApi";

const MovieApplicationManagement = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getMovieApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApprove = async (application: any) => {
    try {
      await updateApplicationStatus(application._id, "approved");
      await createMovie(application);
      fetchApplications();
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await updateApplicationStatus(applicationId, "rejected");
      fetchApplications();
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Movie Applications
      </Typography>
      <Grid container spacing={3}>
        {applications.map((application) => (
          <Grid item xs={12} md={6} key={application._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={application.posterUrl}
                alt={application.title}
              />
              <CardContent>
                <Typography variant="h6">{application.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {application.actorsOrDirectors}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {application.genre.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="h6" color="primary">
                  ${application.price}/day
                </Typography>
                {application.status === "pending" && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(application)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleReject(application._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieApplicationManagement;
