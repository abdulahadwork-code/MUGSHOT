// server/controllers/menuController.js
import MenuItem from "../models/MenuItem.js";
import cloudinary from "../utils/cloudinary.js"; // Import your cloudinary config

export const addMenuItem = async (req, res) => {
  try {
    const { name, color, rotation } = req.body;

    let imageUrl = "";

    // 1. Upload to Cloudinary if a file is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "menu" }, // Same folder as your other controller
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(req.file.buffer); // ✅ Uses the memory buffer instead of a local path
      });
      imageUrl = result.secure_url; // ✅ Save the public Cloudinary URL
    }

    const newItem = await MenuItem.create({
      name,
      color,
      rotation,
      image: imageUrl,
    });

    res.status(201).json({ message: "Coffee added to menu!", item: newItem });
  } catch (error) {
    console.error("ADD MENU ITEM ERROR:", error);
    
    // 2. ✅ Fixed: return a 500 response instead of using the undefined 'next' function
    res.status(500).json({ message: error.message });
  }
};