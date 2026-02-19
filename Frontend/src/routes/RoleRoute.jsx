import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "SELLER") return <Navigate to="/seller" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
