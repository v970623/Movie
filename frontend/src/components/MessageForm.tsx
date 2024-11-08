import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Snackbar,
  Alert,
  Fab,
  Box,
  Typography,
} from "@mui/material";
import { Message as MessageIcon } from "@mui/icons-material";
import { messageAPI } from "../services/api";

const MessageForm = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSendMessage = async () => {
    try {
      await messageAPI.sendMessageToAdmin({ content: message });
      setMessage("");
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Inquiry sent successfully",
        severity: "success",
      });
      alert("Message sent successfully");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send inquiry",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <MessageIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Inquire About Application Progress
          </Typography>
          <TextField
            label="Your Inquiry"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default MessageForm;
