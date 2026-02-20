import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
      {/* <img
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.name}
        loading="lazy"
        className="h-48 w-full object-cover rounded"
      /> */}

      <h2 className="text-lg font-semibold mt-3">{product.productName}</h2>
      <p className="text-gray-600 mt-2 line-clamp-2">
        {product.productDescription}
      </p>
      <p className="text-gray-600 mt-1">$ {product.price}</p>

      <Link
        to={`/product/${product.productId}`}
        className="inline-block mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;
