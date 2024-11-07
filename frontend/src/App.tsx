import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import RentalList from "./pages/admin/RentalList";
import UserRentals from "./pages/UserRentals";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MovieManagement from "./pages/admin/MovieManagement";
import MessageForm from "./components/MessageForm";
import MovieApplicationForm from "./components/MovieApplicationForm";
import MovieApplicationManagement from "./pages/admin/MovieApplicationManagement";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, userRole } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      login();
      setTimeout(() => {
        navigate(userRole === "staff" ? "/admin/rentals" : "/movies");
      }, 1000);
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate, userRole]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: "64px", pb: 4 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies/:id"
              element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-movie"
              element={
                <ProtectedRoute>
                  <MovieApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rentals"
              element={
                <ProtectedRoute>
                  <UserRentals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rentals"
              element={
                <ProtectedRoute requireRole="staff">
                  <RentalList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <ProtectedRoute requireRole="staff">
                  <MovieManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute requireRole="staff">
                  <MovieApplicationManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/messages" element={<MessageForm />} />
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path="/auth/success" element={<OAuthCallback />} />
          </Routes>
        </Box>
        {isAuthenticated && userRole !== "staff" && <MessageForm />}
      </Box>
    </BrowserRouter>
  );
}

export default App;
