import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function UserNavbar() {
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
          <Link to="/cart" className="relative hover:text-gray-300">
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
                Hello, {user?.username}
              </span>

              {user?.role === "USER" && (
                <button onClick={() => navigate("/my-orders")}>
                  My Orders
                </button>
              )}

              <button
                onClick={() => {
                  clearCart();
                  logout();
                  navigate("/", { replace: true });
                }}
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

export default UserNavbar;