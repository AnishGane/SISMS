import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

// To add it in create sales of staff
export const calculateAvgDailySales = (totalSold: number, createdAt: Date) => {
  const now = new Date();
  const days = Math.max(
    1,
    Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );
  return totalSold / days;
};

// Helper: Supplier Normalizer
export const normalizeSupplier = (supplier: any, storeId: string) => {
  // Check if supplier has any meaningful data
  if (!supplier || !supplier.name?.trim()) {
    return null; // Return null instead of empty object
  }

  return {
    // Only include id if it exists and is valid
    ...(supplier.id && mongoose.Types.ObjectId.isValid(supplier.id)
      ? { id: new mongoose.Types.ObjectId(supplier.id) }
      : {}),
    name: supplier.name.trim(),
    phone: supplier.phone?.trim() || "",
    email: supplier.email?.trim() || "",
    address: supplier.address?.trim() || "",
    contactPerson: supplier.contactPerson?.trim() || "",
    notes: supplier.notes?.trim() || "",
    store: new mongoose.Types.ObjectId(storeId),
    metadata: {
      rating: supplier.metadata?.rating || undefined,
      priority: supplier.metadata?.priority || undefined,
    },
  };
};

// Helper: Cloudinary Upload
export const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file buffer exists
    if (!file.buffer) {
      return reject(
        new Error("File buffer is missing. Ensure multer uses memoryStorage.")
      );
    }

    // Validate Cloudinary is configured
    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_SECRET_KEY
    ) {
      return reject(
        new Error("Cloudinary credentials are missing. Check your .env file.")
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "SISMS",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error details:", {
            message: err.message,
            http_code: err.http_code,
            name: err.name,
          });
          return reject(new Error(`Cloudinary upload failed: ${err.message}`));
        }
        if (!result?.secure_url) {
          return reject(new Error("No secure URL returned from Cloudinary"));
        }
        console.log("Image uploaded successfully:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    try {
      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (pipeError: any) {
      console.error("Error piping file to Cloudinary:", pipeError);
      reject(new Error(`Failed to process image: ${pipeError.message}`));
    }
  });
};
