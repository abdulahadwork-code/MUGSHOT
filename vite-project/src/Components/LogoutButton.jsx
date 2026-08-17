import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 py-2 rounded-full bg-[#6f4e37] text-white font-semibold hover:bg-[#5a3e2c] transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;