import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CheckCircle, Cancel, HourglassEmpty } from "@mui/icons-material";

interface Rental {
  _id: string;
  movieId: {
    title: string;
  } | null;
  userId: {
    email: string;
  };
  startDate: string;
  endDate: string;
  status: "new" | "pending" | "accepted" | "rejected";
  totalPrice: number;
}

const API_URL = "http://localhost:5001/api/rentals";
const RentalList = () => {
  const [rentals, setRentals] = React.useState<Rental[]>([]);

  React.useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch(`${API_URL}/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setRentals(data.data);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  const handleStatusUpdate = async (
    rentalId: string,
    newStatus: "new" | "pending" | "accepted" | "rejected"
  ) => {
    try {
      const response = await fetch(`${API_URL}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rentalId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setRentals(
          rentals.map((rental) =>
            rental._id === rentalId ? { ...rental, status: newStatus } : rental
          )
        );
      }
    } catch (error) {
      console.error("Failed to update rental status:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rental Requests
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map(
              (rental) =>
                rental.movieId && (
                  <TableRow key={rental._id}>
                    <TableCell>
                      {rental.movieId.title ? rental.movieId.title : "N/A"}
                    </TableCell>
                    <TableCell>{rental.userId.email}</TableCell>
                    <TableCell>
                      {new Date(rental.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(rental.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${rental.totalPrice}</TableCell>
                    <TableCell>{rental.status}</TableCell>
                    <TableCell>
                      {["new", "pending"].includes(rental.status) && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Pending">
                            <IconButton
                              onClick={() =>
                                handleStatusUpdate(rental._id, "pending")
                              }
                              color="warning"
                            >
                              <HourglassEmpty />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Accept">
                            <IconButton
                              onClick={() =>
                                handleStatusUpdate(rental._id, "accepted")
                              }
                              color="success"
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              onClick={() =>
                                handleStatusUpdate(rental._id, "rejected")
                              }
                              color="error"
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RentalList;
