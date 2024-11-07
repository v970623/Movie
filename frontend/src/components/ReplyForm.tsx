import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { replyToUserMessage } from "../api/messageApi";
const ReplyForm = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [replyMessage, setReplyMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleReply = async () => {
    try {
      await replyToUserMessage({ userId, replyMessage });
      setSnackbar({
        open: true,
        message: "Reply sent successfully",
        severity: "success",
      });
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send reply",
        severity: "error",
      });
    }
  };

  React.useEffect(() => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: "User ID is missing",
        severity: "error",
      });
    }
  }, [userId, navigate]);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Reply to User
        </Typography>
        <TextField
          label="Your Reply"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="contained" onClick={handleReply}>
            Send Reply
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ReplyForm;
