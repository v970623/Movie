import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  styled,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

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
    "& input:-webkit-autofill": {
      "-webkit-box-shadow": "0 0 0 30px white inset !important",
      "-webkit-text-fill-color": "#333 !important",
      "caret-color": "#333",
    },
    "& input:-webkit-autofill:hover": {
      "-webkit-box-shadow": "0 0 0 30px white inset !important",
    },
    "& input:-webkit-autofill:focus": {
      "-webkit-box-shadow": "0 0 0 30px white inset !important",
    },
    "&:hover, &.Mui-focused, &.Mui-filled": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
  "& .MuiInputBase-input": {
    color: "#333",
    "&::placeholder": {
      color: "#666",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#666",
    },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "#666",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  padding: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  backgroundColor: "#000000",
  color: "#ffffff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#333333",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3)",
  },
  "&:disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

const StyledTermsLink = styled(Link)({
  color: "#666",
  textDecoration: "none",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#333",
    textDecoration: "underline",
  },
});

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError(
        "Please read and agree to the Terms of Service and Privacy Policy"
      );
      return;
    }
    setError("");
    setLoading(true);

    try {
      await registerUser(username, email, password, code);
      window.location.href = "/login";
    } catch (error) {
      setError("Registration failed, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "10px",
            backgroundColor: "rgba(253, 237, 237, 0.8)",
          }}
        >
          {error}
        </Alert>
      )}

      <StyledTextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isStaff}
            onChange={(e) => setIsStaff(e.target.checked)}
            sx={{
              color: "#666",
              "&.Mui-checked": { color: "#666" },
            }}
          />
        }
        label="Register as Staff"
        sx={{ mt: 2 }}
      />

      {isStaff && (
        <StyledTextField
          margin="normal"
          fullWidth
          name="code"
          label="Staff Code"
          type="password"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            sx={{
              color: "#666",
              "&.Mui-checked": {
                color: "#666",
              },
            }}
          />
        }
        label={
          <Box sx={{ fontSize: "0.875rem", color: "#666" }}>
            I have read and agree to the
            <StyledTermsLink
              to="/terms-of-service"
              style={{
                marginLeft: "4px",
                marginRight: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Terms of Service
            </StyledTermsLink>
            and
            <StyledTermsLink
              to="/privacy-policy"
              style={{
                marginLeft: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </StyledTermsLink>
          </Box>
        }
        sx={{ mt: 2 }}
      />

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading || !agreedToTerms}
      >
        {loading ? <CircularProgress size={24} /> : "Register"}
      </StyledButton>

      <Box sx={{ textAlign: "center" }}>
        <StyledTermsLink to="/login" sx={{ fontSize: "0.875rem" }}>
          Already have an account? Login now
        </StyledTermsLink>
      </Box>
    </Box>
  );
};
