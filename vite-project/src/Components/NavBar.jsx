import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:p-9 p-3 flex justify-between items-center">

      <Link to="/">
        <img
          src="/images/nav-logo.png"
          alt="Mugshot"
          className="md:w-24 w-20"
        />
      </Link>

      {isLoggedIn ? (
        <LogoutButton />
      ) : (
        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="text-white text-sm md:text-base hover:opacity-80 transition-opacity"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="bg-white text-black px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;