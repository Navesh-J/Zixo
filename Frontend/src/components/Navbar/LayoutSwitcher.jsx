import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import UserNavbar from "./UserNavbar";

function LayoutSwitcher() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Logic: Hide the global UserNavbar if the seller is currently in the dashboard area
  const isSellerArea = location.pathname.startsWith("/seller");
  const shouldHideNavbar = isAuthenticated && user?.role === "SELLER" && isSellerArea;

  if (shouldHideNavbar) {
    return null;
  }

  return <UserNavbar />;
}

export default LayoutSwitcher;