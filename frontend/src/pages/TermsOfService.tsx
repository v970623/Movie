import React from "react";
import { Box, Container, Paper } from "@mui/material";

const TermsOfService = () => {
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
            src="/Terms.html"
            style={{
              width: "100%",
              height: "80vh",
              border: "none",
              borderRadius: "8px",
            }}
            title="Terms of Service"
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;
