import dotenv, { configDotenv } from "dotenv";
import connectDB from "../config/db.js";
import MenuItem from "../models/MenuItem.js";

dotenv.config();

const menuItems = [
  { name: "Classic Latte",     color: "brown",  rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Cappuccino",        color: "red",    rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Iced Cold Brew",    color: "blue",   rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Caramel Macchiato", color: "orange", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Vanilla Mocha",     color: "white",  rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Double Espresso",   color: "black",  rotation: "md:rotate-[8deg] rotate-0" },
];

const seedDatabase = async () => {
    try{
        await connectDB();
        await MenuItem.deleteMany({});
        await MenuItem.create(menuItems)
        console.log("databse succeessfyully seeded");
        process.exit(0)
    }
    catch(error){
        console.log(`seeding failed`, error);
        process.exit(1);
    }
};

seedDatabase();