import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { sendMessage, getMessages } from "../api/messageApi";

interface Message {
  _id: string;
  from: {
    username: string;
  };
  content: string;
  createdAt: string;
}

interface MessageSectionProps {
  applicationId: string;
}

export const MessageSection = ({ applicationId }: MessageSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await getMessages(applicationId);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await sendMessage(applicationId, newMessage);
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message, please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [applicationId]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Message Record
      </Typography>
      <Divider />
      <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
        {messages.map((message) => (
          <ListItem key={message._id}>
            <ListItemText
              primary={message.content}
              secondary={`${message.from.username} - ${new Date(
                message.createdAt
              ).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </Box>
    </Paper>
  );
};
