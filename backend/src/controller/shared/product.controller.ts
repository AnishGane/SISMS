import { Request, Response } from "express";
import ProductModel from "../../models/product.model.js";
import mongoose from "mongoose";

// add product by admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id;

    const {
      name,
      sku,
      category,
      description,
      image,
      price,
      cost,
      unit,
      stock,
      reorderLevel,
      leadTimeDays,
      location,
      supplier,
      avgDailySales,
      metadata,
    } = req.body;

    // Basic validation
    if (!name || !category || !description || !price || !cost) {
      return res.status(400).json({
        success: false,
        message: "Name, category, description, price and cost are required.",
      });
    }

    // Check duplicate by name for same store
    const existing = await ProductModel.findOne({ name, store: storeId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists in your store.",
      });
    }

    // Auto-generate SKU if not provided
    const generatedSku =
      sku ||
      `${name.substring(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    // Supplier object formatting
    let supplierData = undefined;
    if (supplier) {
      supplierData = {
        id: supplier.id ? new mongoose.Types.ObjectId(supplier.id) : undefined,
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
      };
    }

    // Create product
    const product = await ProductModel.create({
      name,
      sku: generatedSku,
      category,
      description,
      image: image || "",
      price,
      cost,
      unit: unit || "pcs",
      stock: stock || 0,
      reorderLevel: reorderLevel || 10,
      leadTimeDays: leadTimeDays || 7,
      location,
      supplier: supplierData,
      avgDailySales: avgDailySales || 0,
      metadata,
      store: storeId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error,
    });
  }
};

export const getProducts = (req: Request, res: Response) => {
  // logic goes here
};

export const updateProduct = (req: Request, res: Response) => {
  // logic goes here
};
