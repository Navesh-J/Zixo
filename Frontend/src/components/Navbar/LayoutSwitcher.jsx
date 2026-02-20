import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import UserNavbar from "./UserNavbar";
// import SellerNavbar from "./SellerNavbar";

function LayoutSwitcher() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith("/seller");

  if (isAuthenticated && user?.role === "SELLER" && isSellerRoute) {
    return null;
  }

  return <UserNavbar />;
}

export default LayoutSwitcher;
