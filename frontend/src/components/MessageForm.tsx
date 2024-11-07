import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { sendMessageToAdmin } from "../api/messageApi";

const UserRentals = () => {
  const [message, setMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSendMessage = async () => {
    try {
      await sendMessageToAdmin({ userId: "currentUserId", message });
      setSnackbar({
        open: true,
        message: "Message sent successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send message",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <TextField
        label="Message to Admin"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      <Button variant="contained" onClick={handleSendMessage}>
        Send Message
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
