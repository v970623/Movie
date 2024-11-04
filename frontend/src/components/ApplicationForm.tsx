import React, { useState, useRef, ChangeEvent } from "react";
import { submitApplication, uploadAttachment } from "../api/applicationApi";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  styled,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

interface ApplicationFormData {
  title: string;
  content: string;
}

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#666",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#666",
    },
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  padding: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  backgroundColor: "#000000",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#333333",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3)",
  },
  "&:disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export const ApplicationForm = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFile = event.target.files[0];

      const isValidType = newFile.type.startsWith("image/");
      const isValidSize = newFile.size <= 30 * 1024 * 1024;

      if (!isValidType || !isValidSize) {
        setError("Only 30MB image files are allowed");
        return;
      }

      setFiles([newFile]);
    }
  };

  const handleFileDelete = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submitResponse = await submitApplication(
        formData.title,
        formData.content
      );

      if (!submitResponse.data?.applicationId) {
        throw new Error("Failed to get application ID");
      }

      const ApplicationId = submitResponse.data.applicationId;

      if (files.length > 0) {
        try {
          await uploadAttachment(ApplicationId, files[0]);
        } catch (error) {
          console.error("File upload failed:", error);
          setError("File upload failed");
        }
      }

      setSuccess(true);
      setFormData({ title: "", content: "" });
      setFiles([]);
      onSubmitSuccess();
    } catch (error) {
      setError("Submission failed, please try again later");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {!expanded ? (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setExpanded(true)}
          variant="contained"
          sx={{ mb: 2 }}
        >
          New Application
        </Button>
      ) : (
        <IconButton onClick={() => setExpanded(false)} sx={{ mb: 2 }}>
          <CloseIcon />
        </IconButton>
      )}

      <Collapse in={expanded}>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Application Title"
            required
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <StyledTextField
            label="Application Content"
            required
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
            >
              Add Image
            </Button>
          </Box>

          {files.length > 0 && (
            <List>
              {files.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={handleFileDelete}
                      disabled={loading || uploading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || uploading}
          >
            {loading || uploading ? (
              <CircularProgress size={24} />
            ) : (
              "Submit Application"
            )}
          </StyledButton>
        </form>
      </Collapse>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Application submitted successfully!
        </Alert>
      )}
    </Box>
  );
};
