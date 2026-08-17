import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🟢 Normal Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Account created! Please log in.");
      setTimeout(() => navigate("/login"), 2000); // Send to login after 2 seconds
    } catch (err) {
      setMessage(err.message);
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
  try {
    console.log("Google credential received:", !!credentialResponse?.credential);

    if (!credentialResponse?.credential) {
      throw new Error("Google did not return a credential.");
    }

    const res = await fetch(
      "http://localhost:5000/api/users/google-auth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
          mode: "signup",
        }),
      }
    );

    const data = await res.json();

    console.log("Google backend response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Google signup failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/order");
    }
  } catch (err) {
    console.error("Google signup error:", err);

    setMessage(
      "Google signup failed: " +
        (err.message || "Something went wrong")
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b2416] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#6f4e37]">Join MUGSHOT ☕</h1>
        
        {/* 🔵 Google Button */}
        <div className="flex justify-center mb-6">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google signup failed")} text="signup_with" />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* 🟢 Normal Form */}
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          <input type="tel" placeholder="Phone (+919876543210)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]" required />
          {message && <p className={`text-sm mb-2 text-center ${message.includes("created") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
          <button type="submit" className="w-full bg-[#6f4e37] text-white py-3 rounded-lg font-bold hover:bg-[#5a3e2c] transition">Create Account</button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-[#6f4e37] font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;