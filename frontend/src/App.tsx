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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, userRole } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Received token:", token);

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
    <AuthProvider>
      <BrowserRouter>
        <CssBaseline />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, pt: "64px" }}>
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
                path="/admin/rentals"
                element={
                  <ProtectedRoute requireRole="staff">
                    <RentalList />
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

              <Route path="/" element={<Navigate to="/movies" replace />} />
              <Route path="/auth/success" element={<OAuthCallback />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
