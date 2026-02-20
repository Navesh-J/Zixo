import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user?.role === "SELLER") return <Navigate to="/seller" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default GuestRoute;