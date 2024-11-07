import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { replyToUserMessage } from "../api/messageApi";

const ReplyForm = ({ userId }) => {
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send reply",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <TextField
        label="Reply to User"
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      <Button variant="contained" onClick={handleReply}>
        Send Reply
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

export default ReplyForm;
