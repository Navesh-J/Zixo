import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === "SELLER") return <Navigate to="/seller" replace />;
    if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;