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
  Tooltip,
} from "@mui/material";
import { movieApplicationAPI } from "@/services/api";

const MovieApplicationManagement = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await movieApplicationAPI.getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApprove = async (application) => {
    try {
      await movieApplicationAPI.updateStatus(application._id, "approved");
      fetchApplications();
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await movieApplicationAPI.updateStatus(applicationId, "rejected");
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
              <Tooltip
                PopperProps={{
                  modifiers: [
                    {
                      name: "zIndex",
                      enabled: true,
                      options: { zIndex: 1300 },
                    },
                  ],
                }}
                title={
                  <img
                    src={application.posterUrl}
                    alt={application.title}
                    style={{ width: "200%" }}
                  />
                }
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={application.posterUrl}
                  alt={application.title}
                />
              </Tooltip>
              <CardContent>
                <Typography variant="h6">Title: {application.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Actors/Directors: {application.actorsOrDirectors}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {application.genre.map((genre) => (
                    <Chip
                      key={genre}
                      label={`Genre: ${genre}`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="h6" color="primary">
                  Price: ${application.price}/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {application.status}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {application.status === "pending" && (
                    <>
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
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieApplicationManagement;
