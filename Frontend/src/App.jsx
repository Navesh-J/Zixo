import { Routes, Route, useLocation, Navigate, Link} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import LayoutSwitcher from "./components/Navbar/LayoutSwitcher";
import SellerLayout from "./components/Navbar/SellerLayout";
import WakeLoader from "./components/WakeLoader";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import CreateProduct from "./pages/seller/CreateProduct";
import EditProduct from "./pages/seller/EditProduct";

import AuthGate from "./routes/AuthGate";
import RoleRoute from "./routes/RoleRoute";
import GuestRoute from "./routes/GuestRoute";

import { useAuth } from "./context/AuthContext";

// 🛸 TRANSITION WRAPPER
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="relative z-10 pt-2 pb-2 px-4 md:px-6 w-full mx-auto min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);

  // 1. INITIALIZATION CHECK (COLD START HANDLER)
  if (!ready) {
    return <WakeLoader onReady={() => setReady(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-goth-black selection:bg-goth-blood selection:text-white overflow-x-hidden">
      {/* 🔮 TERMINAL ATMOSPHERE */}
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />

      {/* NAVBAR LAYER */}
      <div className="relative z-50">
        <LayoutSwitcher />
      </div>

      <AuthGate>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* 🌍 CITIZEN SECTOR (PUBLIC/USER) */}
            <Route
              path="/"
              element={
                isAuthenticated && user?.role === "SELLER" ? (
                  <Navigate to="/seller" replace />
                ) : (
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                )
              }
            />
            <Route
              path="/product/:id"
              element={
                isAuthenticated && user?.role === "SELLER" ? (
                  <Navigate to="/seller" replace />
                ) : (
                  <PageWrapper>
                    <ProductDetails />
                  </PageWrapper>
                )
              }
            />

            {/* 👻 GUEST ACCESS */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <PageWrapper>
                    <Login />
                  </PageWrapper>
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <PageWrapper>
                    <Register />
                  </PageWrapper>
                </GuestRoute>
              }
            />

            {/* 👤 AUTHENTICATED USER ROUTES */}
            <Route
              path="/cart"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <PageWrapper>
                    <Cart />
                  </PageWrapper>
                </RoleRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <PageWrapper>
                    <Checkout />
                  </PageWrapper>
                </RoleRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <PageWrapper>
                    <OrderSuccess />
                  </PageWrapper>
                </RoleRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <PageWrapper>
                    <MyOrders />
                  </PageWrapper>
                </RoleRoute>
              }
            />

            {/* 🏪 MERCHANT TERMINAL (SELLER) */}
            <Route
              path="/seller"
              element={
                <RoleRoute allowedRoles={["SELLER"]}>
                  <SellerLayout />
                </RoleRoute>
              }
            >
              <Route
                index
                element={
                  <PageWrapper>
                    <SellerDashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="products"
                element={
                  <PageWrapper>
                    <SellerProducts />
                  </PageWrapper>
                }
              />
              <Route
                path="products/new"
                element={
                  <PageWrapper>
                    <CreateProduct />
                  </PageWrapper>
                }
              />
              <Route
                path="products/edit/:id"
                element={
                  <PageWrapper>
                    <EditProduct />
                  </PageWrapper>
                }
              />
              <Route
                path="orders"
                element={
                  <PageWrapper>
                    <SellerOrders />
                  </PageWrapper>
                }
              />
            </Route>

            {/* 🛑 VOID FALLBACK */}
            <Route
              path="*"
              element={
                <PageWrapper>
                  <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                    <h1 className="font-heading text-8xl text-goth-blood mb-4 tracking-[0.3em] blur-[2px] animate-pulse">
                      404
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-cyber">
                      Data_Link_Severed // Path_Not_Found
                    </p>
                    <Link
                      to="/"
                      className="mt-8 text-white border border-white px-6 py-2 hover:bg-white hover:text-black transition-all font-heading text-[10px] tracking-widest"
                    >
                      RETURN_TO_UPLINK
                    </Link>
                  </div>
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </AuthGate>
    </div>
  );
}

export default App;
