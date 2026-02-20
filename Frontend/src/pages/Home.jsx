import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService.js";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-12 w-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading products...</p>
    </div>
  );

  if (error) return <p className="text-red-700 text-2xl">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
