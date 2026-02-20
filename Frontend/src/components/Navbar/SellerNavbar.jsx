import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SellerNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/seller" className="text-2xl font-bold tracking-wide">
          ZIXO Seller
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/seller">Dashboard</Link>
          <Link to="/seller/products">My Products</Link>
          <Link to="/seller/orders">Orders</Link>

          <span className="text-gray-300">
            Seller: {user?.username}
          </span>

          <button
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default SellerNavbar;