import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  Grid,
} from "@mui/material";
import { ApplicationList } from "../components/ApplicationList";

const AdminDashboard = () => {
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
          Admin Console
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Welcome to the Application Management System admin console. Here you
          can view and manage all user submissions, track application progress,
          and process application reviews.
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
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#000000",
                mb: 1,
              }}
            >
              Applications List
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              View and manage all applications
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
            <ApplicationList userRole="staff" />
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
