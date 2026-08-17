import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Tell Multer: "When you catch an image, immediately put it in this Cloudinary folder"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mugshot-coffees", // Creates a folder in your Cloudinary dashboard
    allowed_formats: ["jpg", "png", "webp"],
  },
});

// Create the clerk. 'single' means we expect exactly ONE file per request.
const upload = multer({ storage });

export default upload;