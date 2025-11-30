import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  try {
    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_SECRET_KEY
    ) {
      throw new Error("Missing Cloudinary environment variables");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      secure: true, // always use HTTPS
    });

    console.log("Cloudinary Configured Successfully");
  } catch (error) {
    console.error("Cloudinary Configuration Error:", error.message);
    process.exit(1); // Prevent server from running incorrectly
  }
};

export default connectCloudinary;
