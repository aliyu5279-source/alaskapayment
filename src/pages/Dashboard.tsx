import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    fetchOrders();

    // ✅ Subscribe to realtime changes in "orders" table
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("🔄 Realtime update:", payload);
          fetchOrders(); // refetch orders after insert/update/delete
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("❌ Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function addOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !amount) return alert("Please fill in all fields");

    const { error } = await supabase.from("orders").insert([
      {
        customer,
        amount: Number(amount),
        status,
      },
    ]);

    if (error) {
      console.error("❌ Error adding order:", error);
      alert("Failed to add order.");
    } else {
      alert("✅ Order added!");
      setCustomer("");
      setAmount("");
      setStatus("pending");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold">📦 Orders Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Add Order Form */}
        <form
          onSubmit={addOrder}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-700">
            ➕ Add New Order
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Add Order
          </button>
        </form>

        {/* Orders List */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">📋 Orders List</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left text-gray-700 uppercase text-xs">
                    <th className="p-3 border-b">ID</th>
                    <th className="p-3 border-b">Customer</th>
                    <th className="p-3 border-b">Amount</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{order.id}</td>
                      <td className="p-3 border-b">
                        {order.customer || "—"}
                      </td>
                      <td className="p-3 border-b">${order.amount || "0"}</td>
                      <td
                        className={`p-3 border-b font-semibold ${
                          order.status === "paid"
                            ? "text-green-600"
                            : order.status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="p-3 border-b">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
