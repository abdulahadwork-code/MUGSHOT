import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

export const signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message:
          "This email is already registered. Please log in instead.",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
      authProvider: "local",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    res.status(500).json({
      message: "Unable to create account",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Google accounts don't have a password
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "User logged in successfully",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { token, mode = "login" } = req.body;

    console.log("===== GOOGLE AUTH START =====");
    console.log("Mode:", mode);
    console.log("Token received:", !!token);
    console.log(
      "Google Client ID configured:",
      !!process.env.GOOGLE_CLIENT_ID
    );

    if (!token) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is missing from .env");

      return res.status(500).json({
        message: "Google authentication is not configured on the server.",
      });
    }

    const googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID
    );

    console.log("Verifying Google ID token...");

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("Google token verified successfully.");
    console.log("Google email:", payload.email);
    console.log("Google email verified:", payload.email_verified);

    if (!payload.email) {
      return res.status(400).json({
        message: "Google account did not provide an email address.",
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        message: "Google email is not verified.",
      });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || "Google User";

    let user = await User.findOne({ email });

    // =========================
    // GOOGLE SIGNUP
    // =========================
    if (mode === "signup") {
      if (user) {
        return res.status(409).json({
          message:
            "This email is already registered. Please log in instead.",
        });
      }

      console.log("Creating new Google user:", email);

      user = await User.create({
        name,
        email,
        role: "user",
        authProvider: "google",
      });

      console.log("Google user created:", user._id);
    }

    // =========================
    // GOOGLE LOGIN
    // =========================
    else {
      if (!user) {
        return res.status(404).json({
          message:
            "No account found. Please sign up with Google first.",
        });
      }

      console.log("Existing Google user found:", user._id);
    }

    const jwtToken = generateToken(user._id);

    console.log("JWT generated successfully.");
    console.log("===== GOOGLE AUTH SUCCESS =====");

    return res.status(200).json({
      message:
        mode === "signup"
          ? "Account created successfully"
          : "Google login successful",

      token: jwtToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("===== GOOGLE AUTH ERROR =====");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("===== GOOGLE AUTH END =====");

    return res.status(500).json({
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Google authentication failed",
    });
  }
};
export const requestPasswordReset = async (req,res) =>{
  try{
    const { email } = req.body;
    const user = await User.findOne({email})
    if (!user) {
      return res.status(200).json({ message: "If an account exists, an OTP was sent." });
    }
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
     const expiry = Date.now() + 10 * 60 * 1000;
     user.resetPasswordOTP = hashedOTP;
    user.resetPasswordExpires = expiry;
    await user.save();
     console.log(`📧 MUGSHOT PASSWORD RESET OTP FOR ${email}`);
    console.log(`📧 OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const resetPassword = async (req, res) =>{
  try{
  const {email, otp, newPassword} = req.body;
  const user = await User.findOne({email})
  if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = newPassword;
     user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); 


    res.status(200).json({ message: "Password reset successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};