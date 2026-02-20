import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";


function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalAmount,
  } = useCart();

  if (cartItems.length === 0) {
    return <h2 className="text-3xl text-center">Your cart is empty.</h2>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item.productId}
          className="bg-white p-5 mb-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h2 className="text-lg font-semibold">
              {item.productName}
            </h2>
            <p>$ {item.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1)
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1)
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>

            <button
              onClick={() => removeFromCart(item.productId)}
              className="ml-4 text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-xl font-bold">
        Total: $ {totalAmount}
      </div>

      <Link
        to="/checkout"
        className="inline-block mt-4 bg-black text-white px-6 py-3 rounded"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default Cart;
