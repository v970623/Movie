import { Container, Typography, Box, Button } from "@mui/material";
import { ApplicationList } from "../components/ApplicationList";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: "staff" | "public";
  id: string;
}

export const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"staff" | "public">("public");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Raw token:", token);

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded token:", decoded);
      console.log("User role from token:", decoded.role);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Token decode error:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("UserRole state updated:", userRole);
  }, [userRole]);

  console.log("Current user role:", userRole);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Applications List
        </Typography>
      </Box>
      <ApplicationList userRole={userRole} />
    </Container>
  );
};
