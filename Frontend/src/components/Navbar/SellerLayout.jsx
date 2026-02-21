import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

function SellerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("MERCHANT_OFFLINE: Terminal session closed.");
    navigate("/", { replace: true });
  };

  const isActive = (path) => {
    if (path === "/seller") return location.pathname === "/seller";
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: "DASHBOARD", path: "/seller", icon: <LayoutDashboard size={18} /> },
    { label: "INVENTORY", path: "/seller/products", icon: <Package size={18} /> },
    { label: "TRADE_LOGS", path: "/seller/orders", icon: <ShoppingCart size={18} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-goth-black font-cyber">
      {/* 🔹 Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-goth-void border-r border-goth-steel flex flex-col transition-all duration-300 h-full relative z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-goth-steel/50 mb-4">
          {!collapsed && (
            <h1 className="font-heading text-2xl tracking-[0.3em] text-white">ZIXO</h1>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-zinc-500 hover:text-goth-blood transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-all relative group overflow-hidden ${
                isActive(item.path)
                  ? "text-goth-blood"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {isActive(item.path) && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-full bg-goth-blood" />
              )}
              <span className={isActive(item.path) ? "drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]" : ""}>
                {item.icon}
              </span>
              {!collapsed && <span className="text-[11px] tracking-[0.2em] font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-goth-steel/50 bg-black/20">
          {!collapsed && (
            <div className="mb-4 px-2">
              <div className="text-[9px] text-zinc-600 uppercase tracking-widest">Active_Merchant</div>
              <div className="text-xs text-white truncate">{user?.username}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-zinc-500 hover:text-goth-blood hover:bg-goth-blood/5 transition-all group"
          >
            <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            {!collapsed && <span className="text-[11px] tracking-[0.2em] font-bold uppercase">Terminate</span>}
          </button>
        </div>
      </aside>

      {/* 🔹 Main Area */}
      <div className="flex-1 flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.03),transparent)]">
        {/* Top bar */}
        <header className="bg-goth-void/50 backdrop-blur-sm border-b border-goth-steel px-8 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-goth-blood" />
            <h2 className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase">
              Terminal // Status_Normal
            </h2>
          </div>
          <div className="font-cyber text-[10px] text-zinc-500 uppercase tracking-widest">
            {new Date().toLocaleDateString()} // SECURE_LINE
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerLayout;