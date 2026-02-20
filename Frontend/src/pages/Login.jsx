import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectLocation = location.state?.from;

  // ✅ store redirect safely
  if (redirectLocation) {
    sessionStorage.setItem("redirectAfterLogin", redirectLocation.pathname);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const data = await loginUser({ username, password });
      const token = data.token || data.accessToken;

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role !== selectedRole) {
        alert(`This account is not a ${selectedRole}`);
        return;
      }

      login(token);

      // ✅ use stored redirect (bulletproof)
      const savedRedirect = sessionStorage.getItem("redirectAfterLogin");

      if (savedRedirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(savedRedirect, { replace: true });
        return;
      }

      // fallback
      if (decoded.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (decoded.role === "SELLER") {
        navigate("/seller", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="USER">User</option>
          <option value="SELLER">Seller</option>
          <option value="ADMIN">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;