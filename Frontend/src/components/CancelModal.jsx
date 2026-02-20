import { useState } from "react";

const reasons = [
  "Ordered by mistake",
  "Found better price elsewhere",
  "Delivery taking too long",
  "Payment issue",
  "Other",
];

function CancelModal({ order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason;

    if (!finalReason) {
      alert("Please select a reason");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(order.id, finalReason);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold mb-4">Cancel Order #{order.id}</h2>

        {reasons.map((reason) => (
          <label key={reason} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              value={reason}
              checked={selectedReason === reason}
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            {reason}
          </label>
        ))}

        {selectedReason === "Other" && (
          <textarea
            className="w-full border rounded p-2 mt-2"
            placeholder="Enter your reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Close
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
