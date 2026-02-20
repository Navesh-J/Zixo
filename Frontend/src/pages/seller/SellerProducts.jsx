import { useEffect, useRef, useState } from "react";
import { getMyProducts, deleteProduct,getStock } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (user?.username && !hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts(user.username);
      const productsArray = Array.isArray(data) ? data : [];

      const productsWithStock = [];

      // ✅ Sequential fetching (no abort issues)
      for (const product of productsArray) {
        try {
          const stockData = await getStock(product.productId);

          productsWithStock.push({
            ...product,
            stock: stockData?.availableStock ?? 0,
          });
        } catch (err) {
          console.error("Stock fetch failed", err);

          productsWithStock.push({
            ...product,
            stock: 0,
          });
        }
      }

      setProducts(productsWithStock);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);

      // Optimistic update
      setProducts((prev) => prev.filter((p) => p.productId !== id));
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <p className="animate-pulse text-gray-800">Loading products...</p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Products</h1>

      <button
        onClick={() => navigate("/seller/products/new")}
        className="mb-6 bg-black text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {products.length === 0 ? (
        <p className="text-gray-800">No products yet.</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onDelete={handleDelete}
            onEdit={() =>
              navigate(`/seller/products/edit/${product.productId}`)
            }
            deletingId={deletingId}
          />
        ))
      )}
    </div>
  );
}

// 🔹 Product Card Component
function ProductCard({ product, onDelete, onEdit, deletingId }) {
  return (
    <div className="bg-white p-5 mb-4 rounded shadow flex justify-between">
      <div>
        <h2 className="font-semibold">{product.productName}</h2>
        <p>₹ {product.price}</p>

        {/* ✅ Stock Display */}
        <p
          className={`text-sm ${
            product.stock === 0 ? "text-red-500" : "text-gray-500"
          }`}
        >
          Stock: {product.stock}
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onEdit} className="text-blue-600">
          Edit
        </button>

        <button
          onClick={() => onDelete(product.productId)}
          className="text-red-600"
          disabled={deletingId === product.productId}
        >
          {deletingId === product.productId ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default SellerProducts;