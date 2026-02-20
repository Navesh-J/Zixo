import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

function SellerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === "/seller") return location.pathname === "/seller";
    return location.pathname.startsWith(path);
  };

  const getBreadcrumb = () => {
    const path = location.pathname.split("/").filter(Boolean);

    if (path.length === 1) return "Dashboard";
    if (path.includes("products")) {
      if (path.includes("edit")) return "Edit Product";
      if (path.includes("new")) return "Create Product";
      return "Products";
    }
    if (path.includes("orders")) return "Orders";

    return "Dashboard";
  };

  const navItems = [
    { label: "Dashboard", path: "/seller", icon: <LayoutDashboard size={18} /> },
    { label: "Products", path: "/seller/products", icon: <Package size={18} /> },
    { label: "Orders", path: "/seller/orders", icon: <ShoppingCart size={18} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* 🔹 Sidebar (FIXED) */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gray-900 text-white p-4 flex flex-col transition-all duration-300 h-full`}
      >
        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h1
              onClick={() => navigate("/seller")}
              className="text-xl font-bold cursor-pointer"
            >
              ZIXO
            </h1>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                isActive(item.path)
                  ? "bg-gray-800 text-white font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {!collapsed && item.label}
            </button>
          ))}
        </nav>

        {/* Footer (ALWAYS bottom) */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          {!collapsed && (
            <p className="text-xs text-gray-400 mb-3">
              Seller: <span className="text-white">{user?.username}</span>
            </p>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
            className="flex items-center gap-3 px-3 py-2 rounded text-red-400 hover:text-red-300 hover:bg-gray-800 transition w-full"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* 🔹 Main (SCROLLABLE) */}
      <div className="flex-1 flex flex-col h-full">

        {/* Top bar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{getBreadcrumb()}</h2>

          <p className="text-sm text-gray-500">
            Welcome, {user?.username}
          </p>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SellerLayout;