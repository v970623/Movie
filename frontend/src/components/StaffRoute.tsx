import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface StaffRouteProps {
  children: React.ReactNode;
}

const StaffRoute = ({ children }: StaffRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "staff") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default StaffRoute;
