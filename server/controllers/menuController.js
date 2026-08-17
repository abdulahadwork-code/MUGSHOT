import MenuItem from "../models/MenuItem.js";

export const addMenuItem = async (req,res) =>{
    try{
        const {name , color , rotation} = req.body
         const imageUrl = req.file ? req.file.path : "";
        const newItem= await MenuItem.create({name,color,rotation,image: imageUrl })
         res.status(201).json({ message: "Coffee added to menu!", item: newItem });
    }
    catch (error) {
    next(error);
  }
};