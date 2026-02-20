import { useEffect, useState } from "react";
import { getSellerAnalytics } from "../../services/orderService";

function SellerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getSellerAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  if (!analytics)
    return <p className="text-red-500">Failed to load analytics</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Orders" value={analytics.totalOrders} />
        <Card title="Total Revenue" value={`₹ ${analytics.totalRevenue}`} />
        <Card title="Items Sold" value={analytics.totalItemsSold} />
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>

        {analytics.topProducts.length === 0 ? (
          <p className="text-gray-500">No sales yet.</p>
        ) : (
          analytics.topProducts.map((product) => (
            <div key={product.productId} className="flex justify-between mb-3">
              <span>{product.productName}</span>
              <span>
                {product.quantitySold} sold | ₹ {product.revenue}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow border-2 border-emerald-600">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default SellerDashboard;
