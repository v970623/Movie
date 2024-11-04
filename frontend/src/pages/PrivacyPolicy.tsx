import React from "react";
import { Box, Container, Paper } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <iframe
            src="/Policy.html"
            style={{
              width: "100%",
              height: "80vh",
              border: "none",
              borderRadius: "8px",
            }}
            title="Privacy Policy"
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
