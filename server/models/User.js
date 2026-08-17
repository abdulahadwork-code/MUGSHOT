import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    resetPasswordOTP: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// PASSWORD HASHING
// ==========================================
// Mongoose 9 uses async middleware without next()

userSchema.pre("save", async function () {

  // Google users don't have a password
  if (!this.password) {
    return;
  }

  // Don't hash password again if it hasn't changed
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", userSchema);

export default User;