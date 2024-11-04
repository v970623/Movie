import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicationPage from "./pages/ApplicationPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

// OAuth 回调处理组件
function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Received token:", token); // 调试用

    if (token) {
      // 保存 token
      localStorage.setItem("token", token);
      // 更新登录状态
      login();
      // 延迟导航，确保状态更新
      setTimeout(() => {
        navigate("/application");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

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
      <Router>
        <CssBaseline />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              paddingTop: "64px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/application"
                element={
                  <ProtectedRoute>
                    <ApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={<Navigate to="/application" replace />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/auth/success" element={<OAuthCallback />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
