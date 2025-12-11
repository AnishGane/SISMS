import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Validate Cloudinary environment variables
const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "Warning: Cloudinary environment variables are missing. Image uploads will fail."
  );
  console.warn(
    "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file"
  );
} else {
  console.log("Cloudinary configuration loaded successfully");
}

// Only configure if credentials are present
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
    timeout: 60000,
  });
} else {
  console.error("Cloudinary configuration skipped - missing credentials");
}

export default cloudinary;
