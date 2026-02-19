import { useAuth } from "../context/AuthContext";

function AuthGate({ children }) {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return children;
}

export default AuthGate;
