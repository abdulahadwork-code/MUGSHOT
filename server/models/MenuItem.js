import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    color: {
      type: String,
      default: "",
    },

    rotation: {
      type: String,
      default: "",
    },

    image: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;