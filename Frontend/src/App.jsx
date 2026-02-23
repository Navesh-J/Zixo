import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import LayoutSwitcher from "./components/Navbar/LayoutSwitcher";
import SellerLayout from "./components/Navbar/SellerLayout";

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

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="relative z-10 pt-2 pb-2 px-4 md:px-6 w-full max-w-400 mx-auto min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ping`);

        if (!response.ok) {
          throw new Error("Ping failed");
        }

        console.log("Gateway awake");
      } catch (error) {
        console.log("Backend wake-up failed");
      }
    };

    wakeUpBackend();
  }, []);

  return (
    <div className="relative min-h-screen bg-goth-black selection:bg-goth-blood selection:text-white">
      {/* 🔮 CYBER EFFECTS */}
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />

      {/* Navbar sits on top */}
      <div className="relative z-50">
        <LayoutSwitcher />
      </div>

      <AuthGate>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* 🌍 PUBLIC */}
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

            {/* 👻 GUEST */}
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

            {/* 👤 USER */}
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

            {/* 🏪 SELLER */}
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

            {/* 🛑 FALLBACK */}
            <Route
              path="*"
              element={
                <PageWrapper>
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                    <h1 className="font-heading text-6xl text-goth-blood mb-4 tracking-[0.2em]">
                      VOID
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-widest text-sm">
                      The path you seek does not exist in this realm.
                    </p>
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
