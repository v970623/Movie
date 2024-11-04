import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  styled,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";

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
      "-webkit-box-shadow": "0 0 0 30px white inset",
      "-webkit-text-fill-color": "#333",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    "&:hover": {
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
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#333333",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3)",
  },
  "&:disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
const StyledLink = styled(Link)({
  color: "#666666",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#333333",
    textDecoration: "underline",
  },
});

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(username, password || undefined);
      localStorage.setItem("token", response.data.token);
      console.log("Token saved:", response.data.token);
      authContext?.login();
      navigate("/application");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed, please check your username and password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: "8px",
            backgroundColor: "rgba(220, 53, 69, 0.1)",
            color: "#dc3545",
            "& .MuiAlert-icon": {
              color: "#dc3545",
            },
          }}
        >
          {error}
        </Alert>
      )}

      <StyledTextField
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
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
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

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Log In"
        )}
      </StyledButton>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleGoogleLogin}
        startIcon={<GoogleIcon />}
        sx={{ mt: 2 }}
      >
        Use Google account to login
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <StyledLink to="/register">
          Don't have an account? Sign up now
        </StyledLink>
      </Box>
    </Box>
  );
};
