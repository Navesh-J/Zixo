import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, PackageSearch } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

function UserNavbar() {
  const { cartCount, clearCart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCart();
    logout();
    toast.info("SESSION_TERMINATED: You have been logged out.");
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-goth-black/80 backdrop-blur-md border-b border-goth-steel text-white px-6 md:px-12 py-4 sticky top-0 z-100">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-heading font-bold tracking-[0.4em] text-white group-hover:text-goth-blood transition-colors"
          >
            ZIXO
          </motion.span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-8 font-cyber text-[11px] uppercase tracking-widest font-medium">
          <Link to="/cart" className="relative group p-2">
            <ShoppingCart size={20} className="group-hover:text-goth-blood transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-goth-blood text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-none border border-black shadow-[0_0_8px_rgba(225,29,72,0.6)]">
                {cartCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="hover:text-goth-blood transition-colors underline-offset-8 hover:underline">
                [ Login ]
              </Link>
              <Link to="/register" className="bg-white text-black px-4 py-1.5 hover:bg-goth-blood hover:text-white transition-all">
                REGISTER
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] text-zinc-500 uppercase">IDENTIFIED_AS</span>
                <span className="text-white text-xs">{user?.username}</span>
              </div>

              {user?.role === "USER" && (
                <button 
                  onClick={() => navigate("/my-orders")}
                  className="hover:text-goth-blood transition-colors flex items-center gap-2"
                >
                  <PackageSearch size={18} />
                  <span className="hidden sm:inline">ORDERS</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="group p-2 text-zinc-400 hover:text-goth-blood transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;