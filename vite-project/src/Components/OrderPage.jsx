import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";


const OrderPage = () => {
  const [menu, setMenu] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState("");
const [toast, setToast] = useState(null);
const toastTimer = useRef(null);
const tableInputRef = useRef(null);

const toastConfig = {
  success: { icon: "☕", accent: "border-green-600", iconBg: "bg-green-600/15" },
  warning: { icon: "⚠️", accent: "border-amber-500", iconBg: "bg-amber-500/15" },
  error:   { icon: "❌", accent: "border-red-600",   iconBg: "bg-red-600/15" },
};

const showToast = (type, title, message) => {
  setToast({ type, title, message });
  clearTimeout(toastTimer.current);
  toastTimer.current = setTimeout(() => setToast(null), 4200);
};


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        setError("");

        const res = await fetch("http://localhost:5000/api/menu");

        if (!res.ok) {
          throw new Error("Failed to load menu");
        }

        const data = await res.json();

        setMenu(data);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError("Unable to load the menu. Please try again.");
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };


  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      showToast("warning", "Table number needed", "Please enter your table number.");
      tableInputRef.current?.focus();
      return;
    }

    if (cart.length === 0) {
      showToast("warning", "Cart is empty", "Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      showToast("error", "Not logged in", "Please log in before placing an order.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          tableNumber: Number(tableNumber),

          items: cart.map((item) => ({
            menuItem: item._id,
            name: item.name,
            price: Number(item.price || 0),
            quantity: item.quantity,
          })),

          totalAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      showToast("success", "Order placed!", "Your coffee is being prepared. ☕");

      setCart([]);
      setTableNumber("");

    } catch (err) {
      console.error("Place order error:", err);

      showToast("error", "Order failed", "Failed to place order: " + (err.message || "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "/images/placeholder.png";
  };

  return (
    <div className="min-h-screen bg-[#3b2416]">

    
      <NavBar />

    
      <main className="pt-28 px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">

      
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#e3a458]">
  MUGSHOT Ordering ☕
</h1>

            <p className="text-gray-300 mt-2">
  Choose your coffee and place your order.
</p>
          </div>

          <div className="mb-8 bg-white p-5 md:p-6 rounded-2xl shadow-sm">

            <label
              htmlFor="tableNumber"
              className="block text-lg font-bold text-[#6f4e37] mb-2"
            >
              Table Number
            </label>

            <input
              ref={tableInputRef}
              id="tableNumber"
              type="number"
              min="1"
              max="20"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 5"
              className="w-full md:w-80 p-3 border-2 border-[#6f4e37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c49a6c]"
            />

            <p className="text-sm text-gray-500 mt-2">
              Enter the table number where you are sitting.
            </p>
          </div>

          
          {error && (
            <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-xl">
              {error}
            </div>
          )}

         
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

           
            <section className="lg:col-span-2">

              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl md:text-3xl font-bold text-[#e3a458]">Menu</h2>

                <span className="text-sm text-gray-400">{menu.length} items</span>
              </div>

              {menuLoading && (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                  <p className="text-gray-500">
                    Loading menu...
                  </p>
                </div>
              )}

              {!menuLoading && menu.length === 0 && !error && (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                  <p className="text-gray-500">
                    No menu items available.
                  </p>
                </div>
              )}

              {!menuLoading && menu.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {menu.map((item) => {

                    const imageSource = item.image
  ? `http://localhost:5000${item.image}`
  : menuImages[item.name] || "/images/placeholder.png";

                    return (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                      >

                        <div className="w-full h-56 bg-[#f8f3ed] overflow-hidden">

                          <img
                            src={imageSource}
                            alt={item.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />

                        </div>

                        <div className="p-5 flex flex-col flex-1">

                          <h3 className="text-xl font-bold text-[#6f4e37]">
                            {item.name}
                          </h3>

                          <p className="text-[#6f4e37] font-semibold text-lg mt-1 mb-5">
                            $
                            {Number(item.price || 0).toFixed(2)}
                          </p>

                          <button
                            onClick={() => addToCart(item)}
                            className="mt-auto w-full bg-[#6f4e37] text-white py-3 rounded-xl font-bold hover:bg-[#5a3e2c] active:scale-[0.98] transition"
                          >
                            Add to Order
                          </button>

                        </div>
                      </div>
                    );
                  })}

                </div>
              )}
            </section>

            <aside className="lg:col-span-1">

              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg lg:sticky lg:top-28">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-2xl font-bold text-[#6f4e37]">
                    Your Order
                  </h2>

                  {cart.length > 0 && (
                    <span className="bg-[#6f4e37] text-white text-sm px-3 py-1 rounded-full">
                      {cart.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  )}

                </div>
                {cart.length === 0 ? (

                  <div className="py-8 text-center">
                    <p className="text-4xl mb-3">☕</p>

                    <p className="text-gray-500 italic">
                      Your cart is empty
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      Add something delicious from the menu.
                    </p>
                  </div>

                ) : (

                  <div>

                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">

                      {cart.map((item) => (

                        <div
                          key={item._id}
                          className="border-b pb-4"
                        >

                          <div className="flex justify-between gap-3">

                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.name}
                              </h3>

                              <p className="text-sm text-[#6f4e37]">
                                $
                                {Number(item.price || 0).toFixed(2)}
                                {" "}each
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item._id)
                              }
                              className="text-red-500 text-sm hover:underline"
                            >
                              Remove
                            </button>

                          </div>

                          {/* Quantity */}
                          <div className="flex justify-between items-center mt-3">

                            <div className="flex items-center border rounded-lg overflow-hidden">

                              <button
                                onClick={() =>
                                  decreaseQuantity(item._id)
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                              >
                                −
                              </button>

                              <span className="px-4 py-1 font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item._id)
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                              >
                                +
                              </button>

                            </div>

                            <span className="font-bold text-gray-800">
                              $
                              {(
                                Number(item.price || 0) *
                                item.quantity
                              ).toFixed(2)}
                            </span>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* Total */}
                    <div className="border-t pt-5 mb-6">

                      <div className="flex justify-between items-center">

                        <span className="text-xl font-bold text-[#6f4e37]">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-[#6f4e37]">
                          ${totalAmount.toFixed(2)}
                        </span>

                      </div>

                    </div>

                    {/* Place Order */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>

                  </div>
                )}

              </div>
            </aside>

          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed top-6 left-0 right-0 z-[100] mx-auto w-[92%] max-w-md animate-[toast-in_0.35s_ease-out]">
          <div
            className={`flex items-start gap-4 rounded-2xl border-l-4 bg-[#faeade] p-4 shadow-2xl ${toastConfig[toast.type].accent}`}
          >
            <div
              className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-xl ${toastConfig[toast.type].iconBg}`}
            >
              {toastConfig[toast.type].icon}
            </div>

            <div className="flex-1 pt-0.5">
              <h3 className="font-bold text-[#3b2416]">{toast.title}</h3>
              <p className="mt-0.5 text-sm text-[#6f4e37]">{toast.message}</p>
            </div>

            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="self-start rounded-full p-1.5 text-[#6f4e37] transition hover:bg-[#6f4e37]/10"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;