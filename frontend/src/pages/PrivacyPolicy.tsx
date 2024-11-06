import React from "react";
import { Box, Container } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Container
        sx={{
          maxWidth: "100%",
          padding: "20px",
        }}
      >
        <iframe
          src="/Policy.html"
          style={{
            width: "100%",
            height: "80vh",
            border: "none",
          }}
          title="Privacy Policy"
        />
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
