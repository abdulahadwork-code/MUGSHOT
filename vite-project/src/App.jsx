import NavBar from "./components/NavBar";
import HeroSection from "./sections/HeroSection";

import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import gsap from "gsap";

import MessageSection from "./sections/MessageSection";
import FlavorSection from "./sections/FlavorSection";
import BenefitSection from "./sections/BenefitSection";
import TestimonialSection from "./sections/TestimonialSection";
import FooterSection from "./sections/FooterSection";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import LoginPage from "./components/LoginPage";
import SignupPage from "./Components/SignupPage";
import OrderPage from "./components/OrderPage";

import AdminDashboard from "./Components/AdminDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./components/AccessDenied";

import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Google Client ID:", googleClientId);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


// ==========================================
// HOME PAGE
// ==========================================

const Home = () => {

  useGSAP(() => {

    // Create ONLY ONE ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
    });

    return () => {
      smoother.kill();
    };

  });

  return (
    <main>

      <NavBar />

      <div id="smooth-wrapper">

        <div id="smooth-content">

          <HeroSection />

          <MessageSection />

          <FlavorSection />

          <BenefitSection />

          <TestimonialSection />

          <FooterSection />

        </div>

      </div>

    </main>
  );
};


// ==========================================
// APP
// ==========================================

const App = () => {

  return (

    <GoogleOAuthProvider clientId={googleClientId}>

      <BrowserRouter>

        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignupPage />}
          />


          {/* ================= NORMAL USER ================= */}

          <Route
            path="/order"
            element={<OrderPage />}
          />


          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* ================= EMPLOYEE ================= */}

          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />


          {/* ================= ACCESS DENIED ================= */}

          <Route
            path="/access-denied"
            element={<AccessDenied />}
          />

        </Routes>

      </BrowserRouter>

    </GoogleOAuthProvider>

  );
};

export default App;