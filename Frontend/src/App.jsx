import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
// import AdminDashboard from "./pages/AdminDashboard";
// import SellerDashboard from "./pages/SellerDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import AuthGate from "./routes/AuthGate";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <AuthGate>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />

            {/* Guest only */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            {/* Protected */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  {/* <AdminDashboard /> */}
                </RoleRoute>
              }
            />

            <Route
              path="/seller"
              element={
                <RoleRoute allowedRoles={["SELLER"]}>
                  {/* <SellerDashboard /> */}
                </RoleRoute>
              }
            />

            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </AuthGate>
      </div>
    </>
  );
}

export default App;
