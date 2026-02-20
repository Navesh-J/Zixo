import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <div className="h-64 bg-gray-100 rounded mb-6"></div>

      <h1 className="text-3xl font-bold">{product.productName}</h1>

      <p className="text-gray-600 mt-4">{product.productDescription}</p>

      <p className="text-2xl font-bold mt-6">₹ {product.price}</p>

      <button
        onClick={() => {
          if (!isAuthenticated) {
            navigate("/login", {
              state: { from: `/product/${id}` },
              replace: true,
            });
            return;
          }

          addToCart(product);
        }}
        className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
