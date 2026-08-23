import MenuItem from "../models/MenuItem.js";
import cloudinary from "../utils/cloudinary.js";

export const addMenuItem = async (req, res) => {
  try {
    const { name, color, rotation } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "menu" }, 
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(req.file.buffer); 
      });
      imageUrl = result.secure_url; 
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
    res.status(500).json({ message: error.message });
  }
};