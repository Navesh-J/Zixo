import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const { state } = useLocation();

  return (
    <div className="bg-white p-10 rounded shadow text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully!
      </h1>

      {state?.orderId && (
        <p className="mt-2 text-gray-600">Order ID: {state.orderId}</p>
      )}

      <p className="mt-4 text-gray-600">Thank you for shopping with Zixo.</p>

      <Link
        to="/"
        className="inline-block mt-6 bg-black text-white px-6 py-3 rounded"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccess;
