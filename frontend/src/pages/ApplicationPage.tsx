import { Container, Typography, Box, Paper } from "@mui/material";
import { ApplicationForm } from "../components/ApplicationForm";
import { ApplicationList } from "../components/ApplicationList";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  role: "staff" | "public";
  id: string;
}

const ApplicationPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"staff" | "public">("public");
  const listRef = useRef<{ fetchApplications: () => void } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserRole(decoded.role);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmitSuccess = () => {
    listRef.current?.fetchApplications();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {userRole === "staff" ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Application Management
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <ApplicationList userRole="staff" />
          </Paper>
        </>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Submit Application
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <ApplicationForm onSubmitSuccess={handleSubmitSuccess} />
          </Paper>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Applications
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <ApplicationList ref={listRef} userRole="public" />
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ApplicationPage;
