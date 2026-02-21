import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // Show a themed "Accessing Data" state while auth is being checked
  if (authLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-6 w-6 text-goth-blood/40 animate-spin" strokeWidth={1.5} />
        <span className="font-cyber text-[9px] uppercase tracking-[0.4em] text-zinc-700">
          Validating_Credentials...
        </span>
      </div>
    );
  }

  // If not logged in, shunt them to the login terminal
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;