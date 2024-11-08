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
  AddCircleOutline as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MovieSearch from "./MovieSearch";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const isStaff = userRole === "staff";

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
          Movie Rental
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {!isStaff && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/movies")}
                startIcon={<MovieIcon />}
                sx={{ textTransform: "none" }}
              >
                Movies
              </Button>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => navigate("/submit-movie")}
              >
                Submit Movie
              </Button>
              <Button
                color="inherit"
                startIcon={<RentalIcon />}
                onClick={() => navigate("/my-rentals")}
              >
                My Rentals
              </Button>
            </>
          )}

          {isStaff && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/admin/movies")}
                startIcon={<AdminIcon />}
              >
                Movie Management
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/admin/applications")}
                startIcon={<AdminIcon />}
              >
                Applications
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/admin/rentals")}
                startIcon={<RentalIcon />}
              >
                Rental Management
              </Button>
              <Button color="inherit"></Button>
              <MovieSearch />
            </>
          )}
        </Box>

        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
