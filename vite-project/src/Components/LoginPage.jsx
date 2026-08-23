import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Save authentication
    localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

if (data.user.role === "admin") {
  navigate("/admin");
} else if (data.user.role === "employee") {
  navigate("/employee");
} else {
  navigate("/order");
}
  } catch (err) {
    setMessage(err.message);
  }
};

 const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await fetch(
      "/api/users/google-auth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
          mode: "login",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

if (data.user.role === "admin") {
  navigate("/admin");
} else if (data.user.role === "employee") {
  navigate("/employee");
} else {
  navigate("/order");
}

  } catch (err) {
    setMessage("Google login failed: " + err.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b2416] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#6f4e37]">Welcome Back ☕</h1>
        
        <div className="flex justify-center mb-6">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google login failed")} />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          {message && <p className="text-red-500 text-sm mb-2 text-center">{message}</p>}
          <button type="submit" className="w-full bg-[#6f4e37] text-white py-3 rounded-lg font-bold hover:bg-[#5a3e2c] transition">Sign In</button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          New to Mugshot? <Link to="/signup" className="text-[#6f4e37] font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;