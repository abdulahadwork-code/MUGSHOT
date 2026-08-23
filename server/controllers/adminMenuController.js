
import MenuItem from "../models/MenuItem.js";
import cloudinary from "../utils/cloudinary.js"; 

export const getAdminMenu = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error("GET ADMIN MENU ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, color, rotation } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required.",
      });
    }

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

    const item = await MenuItem.create({
      name,
      price: Number(price),
      image: imageUrl,
      color: color || "",
      rotation: rotation || "",
    });

    res.status(201).json({
      message: "Menu item created successfully.",
      item,
    });
  } catch (error) {
    console.error("CREATE MENU ITEM ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, color, rotation } = req.body;

    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    item.name = name ?? item.name;
    item.price = price !== undefined ? Number(price) : item.price;
    item.color = color ?? item.color;
    item.rotation = rotation ?? item.rotation;

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
      
      item.image = result.secure_url;
    }

    await item.save();

    res.status(200).json({
      message: "Menu item updated successfully.",
      item,
    });
  } catch (error) {
    console.error("UPDATE MENU ITEM ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      message: "Menu item deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE MENU ITEM ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};