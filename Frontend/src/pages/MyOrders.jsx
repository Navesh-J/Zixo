import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, payOrder } from "../services/orderService";
import CancelModal from "../components/CancelModal";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  const handleCancel = async (orderId, reason) => {
    try {
      setLoadingAction(orderId);

      const updated = await cancelOrder(orderId, reason);

      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

      setSelectedOrder(null);
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePay = async (orderId) => {
    try {
      setLoadingAction(orderId);

      const updated = await payOrder(orderId);

      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "INVENTORY_RESERVED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No orders yet.</p>
          <p className="text-sm mt-2">
            Start shopping to see your orders here.
          </p>
        </div>
      )}

      {orders.map((order) => (
        <div key={order.id} className="bg-white p-6 mb-6 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">Order #{order.id}</h2>
              <p className="text-sm text-gray-500">
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${getStatusStyle(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>

          <div className="mt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>₹ {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 font-bold">Total: ₹ {order.totalAmount}</div>

          {/* Pay Button */}
          {order.orderStatus === "INVENTORY_RESERVED" && (
            <button
              disabled={loadingAction === order.id}
              onClick={() => handlePay(order.id)}
              className="mt-4 mr-3 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loadingAction === order.id ? "Processing..." : "Pay Now"}
            </button>
          )}

          {/* Cancel Button */}
          {order.orderStatus !== "COMPLETED" &&
            order.orderStatus !== "CANCELLED" && (
              <button
                disabled={loadingAction === order.id}
                onClick={() => setSelectedOrder(order)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}

          {/* Cancel Reason */}
          {order.orderStatus === "CANCELLED" && order.cancellationReason && (
            <p className="mt-3 text-sm text-gray-600">
              Reason: {order.cancellationReason}
            </p>
          )}
        </div>
      ))}

      {selectedOrder && (
        <CancelModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}

export default MyOrders;
