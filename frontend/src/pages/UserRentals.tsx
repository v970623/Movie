import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { rentalApi } from "../api/rentalApi";

const UserRentals = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await rentalApi.getRentals();
        setRentals(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        My Rental History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movie</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rentals.map((rental: any) => (
            <TableRow key={rental._id}>
              {rental.movieId ? (
                <>
                  <TableCell>{rental.movieId.title}</TableCell>
                  <TableCell>
                    {new Date(rental.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(rental.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${rental.totalPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={rental.status}
                      color={
                        rental.status === "pending"
                          ? "warning"
                          : rental.status === "accepted" ||
                            rental.status === "new"
                          ? "success"
                          : rental.status === "rejected"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>N/A</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserRentals;
