import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    // Instead of null, show a minimal themed loader
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-zinc-800 animate-spin" />
      </div>
    );
  }

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
