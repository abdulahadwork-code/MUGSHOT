import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/menu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load menu");
      }

      setMenu(data);
    } catch (error) {
      console.error("Fetch menu error:", error);

      setError(error.message);

      if (
        error.message.toLowerCase().includes("admin") ||
        error.message.toLowerCase().includes("authorized")
      ) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

 const resetForm = () => {
  setName("");
  setPrice("");
  setImageFile(null);
  setEditingId(null);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Please enter a menu item name.");
    return;
  }

  if (price === "" || Number(price) < 0) {
    alert("Please enter a valid price.");
    return;
  }

  // Image is required when creating a new item
  if (!editingId && !imageFile) {
    alert("Please select an image.");
    return;
  }

  try {
    setSubmitting(true);

    const url = editingId
      ? `${API_URL}/api/admin/menu/${editingId}`
      : `${API_URL}/api/admin/menu`;

    const method = editingId ? "PUT" : "POST";

    // IMPORTANT: use FormData for file upload
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("price", Number(price));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to ${
            editingId ? "update" : "create"
          } menu item`
      );
    }

    alert(
      editingId
        ? "Menu item updated successfully."
        : "Menu item added successfully."
    );

    resetForm();

    await fetchMenu();

  } catch (error) {
    console.error("Menu submit error:", error);
    alert(error.message);
  } finally {
    setSubmitting(false);
  }
};

  const handleEdit = (item) => {
  setEditingId(item._id);
  setName(item.name || "");
  setPrice(item.price ?? "");
  setImageFile(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/menu/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete item"
        );
      }

      alert("Menu item deleted successfully.");

      await fetchMenu();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#3b2416] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">☕</div>

          <p className="text-xl font-semibold text-[#6f4e37]">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3b2416]">

      <header className="bg-[#6f4e37] text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm opacity-80 tracking-widest">
                MUGSHOT
              </p>

              <h1 className="text-3xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-sm opacity-80 mt-1">
                Manage your coffee menu
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => navigate("/order")}
                className="bg-white text-[#6f4e37] px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Customer Menu
              </button>

              <button
                onClick={handleLogout}
                className="border border-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#6f4e37] transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-xl">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-10">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-[#6f4e37]">

              {editingId
                ? "Edit Menu Item"
                : "Add New Menu Item"}

            </h2>

            <p className="text-gray-500 mt-1">
              {editingId
                ? "Update the selected menu item."
                : "Add a new coffee item to your menu."}
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Caramel Latte"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 5.50"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                  required
                />
              </div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Coffee Image
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) => {
      setImageFile(e.target.files[0] || null);
    }}
    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
  />

  {imageFile && (
    <p className="text-sm text-gray-500 mt-2">
      Selected: {imageFile.name}
    </p>
  )}
</div>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#6f4e37] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#5a3e2c] transition disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Update Item"
                  : "Add Item"}
              </button>


              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-7 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>
        <section>

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-[#6f4e37]">
                Menu Items
              </h2>

              <p className="text-gray-500 mt-1">
                {menu.length} item{menu.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {menu.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <div className="text-5xl mb-4">
                ☕
              </div>

              <h3 className="text-xl font-bold text-gray-700">
                No menu items
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first menu item above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {menu.map((item) => {

                const image = item.image
  ? `${API_URL}${item.image}`
  : "/images/black-drink.webp";
                return (

                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                  >

                    <div className="h-56 bg-[#f8f3ed]">

                      <img
                        src={image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/black-drink.webp";
                        }}
                      />

                    </div>

                    <div className="p-5">

                      <h3 className="text-xl font-bold text-[#6f4e37]">
                        {item.name}
                      </h3>

                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        $
                        {Number(item.price || 0).toFixed(2)}
                      </p>

                      <div className="flex gap-3 mt-5">

                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-[#6f4e37] text-white py-2.5 rounded-lg font-semibold hover:bg-[#5a3e2c] transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;