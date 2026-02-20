import { useEffect, useState } from "react";
import { getSellerOrders } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load seller orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0)
    return <p className="text-gray-500">No orders yet.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {orders.map((order) => {
        // ⭐ FILTER seller-specific items
        const sellerItems = order.items.filter(
          (item) => item.sellerUsername === user.username,
        );

        if (sellerItems.length === 0) return null;

        return (
          <div key={order.id} className="bg-white p-6 mb-6 rounded shadow">
            <div className="flex justify-between">
              <h2 className="font-semibold">Order #{order.id}</h2>
              <span className="text-sm">{order.orderStatus}</span>
            </div>

            <p className="text-sm text-gray-500">
              {new Date(order.orderDate).toLocaleString()}
            </p>

            <div className="mt-4">
              {sellerItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SellerOrders;
