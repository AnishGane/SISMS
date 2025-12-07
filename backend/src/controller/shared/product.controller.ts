import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../../models/product.model.js";

// Extend Express Request to include authenticated user
interface AuthRequest extends Request {
  user?: { _id: string; store?: string };
}

// CREATE PRODUCT
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

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
    if (
      !name ||
      !category ||
      !description ||
      price === undefined ||
      cost === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, category, description, price, and cost are required.",
      });
    }

    // Trim string fields
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();

    // Check duplicate by name for same store
    const existing = await ProductModel.findOne({
      name: trimmedName,
      store: storeId,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists in your store.",
      });
    }

    // Auto-generate SKU if not provided
    const generatedSku =
      sku ||
      `${trimmedName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Supplier object formatting
    let supplierData = undefined;
    if (supplier) {
      supplierData = {
        id:
          supplier.id && mongoose.Types.ObjectId.isValid(supplier.id)
            ? new mongoose.Types.ObjectId(supplier.id)
            : undefined,
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
      };
    }

    // Create product
    const product = await ProductModel.create({
      name: trimmedName,
      sku: generatedSku,
      category: trimmedCategory,
      description: trimmedDescription,
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
    });
  }
};

// GET PRODUCTS
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const storeId = req.user.store || req.user._id;
    const {
      search = "",
      category,
      page = 1,
      limit = 20,
      sort = "newest",
      active = "true",
    } = req.query;

    const query: any = { store: storeId };

    // Active / inactive filter
    if (active === "true") query.isActive = true;
    else if (active === "false") query.isActive = false;

    // Category filter
    if (category) query.category = category;

    // Text search
    if (search) query.$text = { $search: String(search) };

    const skip = (Number(page) - 1) * Number(limit);

    const sortOptions: any = {};
    if (sort === "newest") sortOptions.createdAt = -1;
    else if (sort === "oldest") sortOptions.createdAt = 1;
    else if (sort === "stockLow") sortOptions.stock = 1;
    else if (sort === "stockHigh") sortOptions.stock = -1;

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      ProductModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// UPDATE PRODUCT

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const storeId = req.user.store || req.user._id;
    const productId = req.params.id;

    const product = await ProductModel.findOne({
      _id: productId,
      store: storeId,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

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
      isActive,
    } = req.body;

    // Check name duplicate
    if (name && name !== product.name) {
      const duplicate = await ProductModel.findOne({
        name,
        store: storeId,
        _id: { $ne: productId },
      });
      if (duplicate)
        return res.status(409).json({
          success: false,
          message: "Another product with this name exists",
        });
      product.name = name.trim();
      if (!sku)
        product.sku = `${name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check SKU uniqueness if provided
    if (sku && sku !== product.sku) {
      const skuDuplicate = await ProductModel.findOne({
        sku,
        store: storeId,
        _id: { $ne: productId },
      });
      if (skuDuplicate)
        return res.status(409).json({
          success: false,
          message: "Another product with this SKU exists",
        });
      product.sku = sku;
    }

    // Update other fields dynamically
    const fieldsToUpdate: Record<string, any> = {
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
      avgDailySales,
      metadata,
      isActive,
    };
    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (value !== undefined) (product as any)[key] = value;
    });

    // Update supplier safely
    if (supplier) {
      product.supplier = {
        id:
          supplier.id && mongoose.Types.ObjectId.isValid(supplier.id)
            ? new mongoose.Types.ObjectId(supplier.id)
            : undefined,
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
      };
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

// Get a one product and its whole details
export const getEachProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;
    const productId = req.params.id;

    if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    // Find the product belonging to this store
    const product = await ProductModel.findOne({
      _id: productId,
      store: storeId,
    }).lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get Each Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
