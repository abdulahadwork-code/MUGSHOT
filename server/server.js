import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import MenuItem from "./models/MenuItem.js";
dotenv.config();
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import { globalErrorHandler } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";

const app=express()

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req,res)=>{
    res.json({ status: "ok" , message:"backend is working"})
})

const PORT = process.env.PORT || 5000;

connectDB();
app.get("/api/menu", async (req,res) => {
    try{
       const items = await MenuItem.find();
       res.json(items)
    }
    catch{
      res.status(500).json({ message:"server error"})
    }
    
})

app.get("/api/menu/update-prices", async (req, res) => {
  try {
    const prices = {
      "Double Espresso": 5,
      "Caramel Macchiato": 5,
      "Classic Latte": 4.5,
      "Cappuccino": 4.5,
      "Iced Cold Brew": 5,
      "Vanilla Mocha": 5.5,
    };

    for (const [name, price] of Object.entries(prices)) {
      await MenuItem.updateOne(
        { name: name },
        { $set: { price: price } }
      );
    }

    res.json({
      message: "Prices updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use(globalErrorHandler); 
app.listen(PORT,()=>{
    console.log(`server is running on localhost${PORT}`);
});