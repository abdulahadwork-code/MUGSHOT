import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        "/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

const activeOrders = data.orders.filter(
  (order) =>
    order.status !== "delivered" &&
    order.status !== "cancelled"
);

setOrders(activeOrders);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

if (
  status === "delivered" ||
  status === "cancelled"
) {
  setOrders((previousOrders) =>
    previousOrders.filter(
      (order) => order._id !== orderId
    )
  );
} else {

  setOrders((previousOrders) =>
    previousOrders.map((order) =>
      order._id === orderId
        ? data.order
        : order
    )
  );
}
    } catch (error) {
      alert(error.message);
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
        <h1 className="text-3xl text-[#6f4e37]">
          Loading orders...
        </h1>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#3b2416] px-8 py-10">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h1 className="text-5xl font-bold text-[#6f4e37]">
            Employee Dashboard 
          </h1>

          <p className="text-gray-600 mt-2">
            Manage customer orders
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-[#6f4e37] text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>


      {message && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#6f4e37]">
          Total Orders: {orders.length}
        </h2>
      </div>

      {orders.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-12 text-center">
          <h2 className="text-3xl text-gray-500">
            No orders yet ☕
          </h2>

          <p className="mt-3 text-gray-400">
            New customer orders will appear here.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              <div className="flex justify-between items-start mb-5">

                <div>
                  <h2 className="text-2xl font-bold text-[#6f4e37]">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Table:{" "}
                    <strong>
                      {order.tableNumber}
                    </strong>
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Customer:{" "}
                    {order.user?.name || "Unknown"}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {order.user?.email || ""}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border border-[#6f4e37] rounded-lg px-3 py-2"
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="preparing">
                    Preparing
                  </option>

                  <option value="ready">
                    Ready
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              <div className="border-t border-gray-200 pt-4">

                <h3 className="font-bold text-xl mb-3">
                  Items
                </h3>

                {order.items.map((item, index) => (

                  <div
                    key={index}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >

                    <div>
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-gray-500">
                        ${Number(item.price).toFixed(2)}
                        {" × "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold">
                      $
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>

                ))}

              </div>

              <div className="flex justify-between items-center mt-5">

                <span className="text-xl font-bold">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#6f4e37]">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>

              </div>

              <div className="mt-5">

                <span className="text-gray-500">
                  Current status:
                </span>

                <span className="ml-2 font-bold capitalize text-[#6f4e37]">
                  {order.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default EmployeeDashboard;