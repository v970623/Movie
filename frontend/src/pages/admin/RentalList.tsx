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
} from "@mui/material";

interface Rental {
  _id: string;
  movieId: {
    title: string;
  };
  userId: {
    email: string;
  };
  startDate: string;
  endDate: string;
  status: "new" | "pending" | "accepted" | "rejected";
  totalPrice: number;
}

const RentalList = () => {
  const [rentals, setRentals] = React.useState<Rental[]>([]);

  React.useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/rentals/all", {
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
      const response = await fetch("http://localhost:5001/api/rentals/status", {
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
    <TableContainer component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Rental Requests
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movie</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental._id}>
              <TableCell>{rental.movieId.title}</TableCell>
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
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(rental._id, "pending")}
                      color="warning"
                    >
                      Pending
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(rental._id, "accepted")}
                      color="success"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(rental._id, "rejected")}
                      color="error"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RentalList;
