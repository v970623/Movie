import React from "react";
import { RegisterForm } from "../components/RegisterForm";
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const theme = useTheme();

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          background:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          padding: 6,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Join Us Today
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Create your account to start submitting applications and accessing our
          services. Join our platform to manage your applications efficiently.
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#000000",
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Fill in your details to get started
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <RegisterForm />
          </Paper>

          <Box
            sx={{
              mt: 3,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Link
              to="/privacy-policy"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
