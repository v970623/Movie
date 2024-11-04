import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: "staff" | "public";
  id: string;
}

const StyledAppBar = styled(AppBar)({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
});

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        {location.pathname !== "/" && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ color: "#666" }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#333" }}
        >
          Application System
        </Typography>

        {userRole === "staff" ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/application")}
              sx={{ color: "#666" }}
            >
              <DashboardIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/application")}
              sx={{ color: "#666" }}
            >
              <AssignmentIcon />
            </IconButton>
          </Box>
        )}

        <IconButton
          color="inherit"
          onClick={handleLogout}
          sx={{ color: "#666", ml: 1 }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
