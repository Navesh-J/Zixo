import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <>
      <LayoutSwitcher />

      <AuthGate>
        <Routes>
          {/* 🌍 PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* 👻 GUEST */}
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

          {/* 👤 USER */}
          <Route
            path="/cart"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <Cart />
              </RoleRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <Checkout />
              </RoleRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <OrderSuccess />
              </RoleRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <MyOrders />
              </RoleRoute>
            }
          />
          {/* 🏪 SELLER (NESTED ROUTES) */}
          <Route
            path="/seller"
            element={
              <RoleRoute allowedRoles={["SELLER"]}>
                <SellerLayout />
              </RoleRoute>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>

          {/* 🛑 FALLBACK */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </AuthGate>
    </>
  );
}

export default App;
