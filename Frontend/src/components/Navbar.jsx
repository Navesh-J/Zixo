import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount, clearCart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white px-8 py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          ZIXO
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          {/* <Link to="/" className="hover:text-gray-300 transition">
            Home
          </Link> */}

          <Link to="/cart" className="relative hover:text-gray-300 transition">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-gray-300">
                Hello, {user?.username || "User"}
              </span>
              <button
                onClick={() => {
                  navigate("/my-orders");
                }}
                className="hover:text-gray-300 transition"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  clearCart();
                  logout();
                  navigate("/", { replace: true });
                }}
                className="hover:text-gray-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
