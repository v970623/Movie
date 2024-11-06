import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import {
  Movie as MovieIcon,
  VideoLibrary as RentalIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => navigate("/movies")}
          edge="start"
        >
          <MovieIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
          Movie Rental System
        </Typography>

        {userRole === "staff" ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<AdminIcon />}
              onClick={() => navigate("/admin/rentals")}
            >
              Rental Management
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<RentalIcon />}
              onClick={() => navigate("/my-rentals")}
            >
              My Rentals
            </Button>
          </Box>
        )}

        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
