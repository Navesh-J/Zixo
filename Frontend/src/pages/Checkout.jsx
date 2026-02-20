import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const [loading, setLoading] = useState(false);

  const { cartItems, cartItemsForOrder, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (cartItems.length === 0) {
    return <h2 className="text-2xl">No items to checkout.</h2>;
  }

  const handlePlaceOrder = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const order = await createOrder(cartItemsForOrder);

      clearCart();

      navigate("/order-success", {
        replace: true,
        state: { orderId: order?.orderId },
      });
    } catch (error) {
      alert(
        error?.response?.data?.message || "Order failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

      {cartItems.map((item) => (
        <div key={item.productId} className="flex justify-between mb-3">
          <span>
            {item.productName} × {item.quantity}
          </span>
          <span>₹ {item.price * item.quantity}</span>
        </div>
      ))}

      <div className="text-xl font-bold mt-6">Total: ₹ {totalAmount}</div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-6 bg-black text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Checkout"}
      </button>
    </div>
  );
}

export default Checkout;
