import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "staff" | "public";
}

export const ProtectedRoute = ({
  children,
  requireRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireRole && userRole !== requireRole) {
    return <Navigate to="/movies" />;
  }

  return <>{children}</>;
};
