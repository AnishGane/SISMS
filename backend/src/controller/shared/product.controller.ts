import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../../models/product.model.js";
import { levenshtein } from "../../utils/levenshteinalgo.js";
import { normalizeSupplier, uploadToCloudinary } from "../../utils/helper.js";

type ProductImageFiles = {
  image1?: Express.Multer.File[];
  image2?: Express.Multer.File[];
  image3?: Express.Multer.File[];
  image4?: Express.Multer.File[];
};

interface AuthRequest extends Request {
  user?: { _id: string; store?: string };
}

interface Product {
  _id: string;
  name: string;
  store: string;
}

interface ScoredProduct {
  product: Product;
  score: number;
  threshold: number;
  hasSubstring: boolean;
}

// CREATE PRODUCT
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    console.log("=== CREATE PRODUCT REQUEST ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    // Authentication check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const storeId = req.user.store || req.user._id;

    const {
      name,
      sku,
      category,
      description,
      price,
      cost,
      unit,
      stock,
      reorderLevel,
      leadTimeDays,
      location,
      metadata,
      salesHistory,
    } = req.body;

    // Parse supplier if it's a JSON string
    let supplier = null;
    if (req.body.supplier) {
      try {
        supplier =
          typeof req.body.supplier === "string"
            ? JSON.parse(req.body.supplier)
            : req.body.supplier;
      } catch (e) {
        console.error("Failed to parse supplier data:", e);
      }
    }

    if (!name?.trim() || !category?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and description are required.",
      });
    }

    if (
      price === undefined ||
      price === null ||
      cost === undefined ||
      cost === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Price and cost are required.",
      });
    }

    if (isNaN(Number(price)) || isNaN(Number(cost))) {
      return res.status(400).json({
        success: false,
        message: "Price and cost must be valid numbers.",
      });
    }

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();

    // Check for duplicate product
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

    // Handle image uploads
    const files = req.files as ProductImageFiles;
    const filesArray = [
      files?.image1?.[0],
      files?.image2?.[0],
      files?.image3?.[0],
      files?.image4?.[0],
    ].filter((file): file is Express.Multer.File => Boolean(file));

    if (filesArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required.",
      });
    }

    // Upload images to Cloudinary
    let uploadedImageUrls: string[] = [];
    try {
      console.log(`Uploading ${filesArray.length} image(s) to Cloudinary...`);
      uploadedImageUrls = await Promise.all(
        filesArray.map((file, index) => {
          console.log(
            `Uploading image ${index + 1}/${filesArray.length} (${file.size} bytes)`
          );
          return uploadToCloudinary(file);
        })
      );
      console.log(`Successfully uploaded ${uploadedImageUrls.length} image(s)`);
    } catch (uploadError: any) {
      console.error("Image upload failed with error:", {
        message: uploadError?.message,
        stack: uploadError?.stack,
        name: uploadError?.name,
      });
      return res.status(500).json({
        success: false,
        message:
          uploadError?.message || "Failed to upload images. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? uploadError?.message
            : undefined,
      });
    }

    // Generate SKU
    const generatedSku =
      sku?.trim() ||
      `${trimmedName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check SKU uniqueness
    const existingSku = await ProductModel.findOne({
      sku: generatedSku,
      store: storeId,
    });

    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: "Product with this SKU already exists.",
      });
    }

    // Normalize supplier(handles null properly)
    const supplierData = normalizeSupplier(supplier, storeId);

    const productData: any = {
      name: trimmedName,
      sku: generatedSku,
      category: trimmedCategory,
      description: trimmedDescription,
      image: uploadedImageUrls,
      price: Number(price),
      cost: Number(cost),
      unit: unit?.trim() || "pcs",
      stock: Number(stock) || 0,
      reorderLevel: Number(reorderLevel) || 10,
      leadTimeDays: Number(leadTimeDays) || 7,
      location: location?.trim() || "",
      // avgDailySales: Number(avgDailySales) || 0,
      salesHistory: salesHistory || [],
      store: storeId,
      isActive: true,
    };

    // Only add supplier if it has valid data
    if (supplierData) {
      productData.supplier = supplierData;
    }

    // Parse metadata if sent as JSON string
    let parsedMetadata = null;

    if (req.body.metadata) {
      try {
        parsedMetadata =
          typeof req.body.metadata === "string"
            ? JSON.parse(req.body.metadata)
            : req.body.metadata;
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }
    }

    if (parsedMetadata) {
      productData.metadata = parsedMetadata;
    }

    const product = await ProductModel.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Create Product Error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error. SKU or name already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product. Please try again.",
    });
  }
};

// GET PRODUCTS
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;
    const search = (req.query.search as string)?.trim().toLowerCase() || "";
    const category = (req.query.category as string)?.toLowerCase() || "all";

    let allProducts = await ProductModel.find({ store: storeId }).lean();

    if (category !== "all") {
      allProducts = allProducts.filter(
        (p) => p.category?.toLowerCase() === category
      );
    }

    if (search) {
      const scoredProducts: ScoredProduct[] = allProducts.map((p: any) => {
        const name = (p.name || "").toLowerCase();
        const hasSubstring = name.includes(search);
        const score = hasSubstring
          ? 0
          : levenshtein(search, name) / Math.max(search.length, name.length);
        const threshold = search.length <= 2 ? 0.6 : 0.5;

        return { product: p, score, hasSubstring, threshold };
      });

      allProducts = scoredProducts
        .filter((r) => r.score <= r.threshold)
        .sort((a, b) => (a.hasSubstring ? -1 : 1) || a.score - b.score)
        .map((r) => r.product);
    }

    if (allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your criteria",
      });
    }

    return res.json({ success: true, data: allProducts });
  } catch (err) {
    console.error("Get Products Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await ProductModel.findOne({
      _id: productId,
      store: storeId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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
      // avgDailySales,
      metadata,
      isActive,
    } = req.body;

    // Check name duplicate
    if (name && name.trim() !== product.name) {
      const duplicate = await ProductModel.findOne({
        name: name.trim(),
        store: storeId,
        _id: { $ne: productId },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another product with this name exists",
        });
      }
      product.name = name.trim();
    }

    // Check SKU uniqueness if provided
    if (sku && sku !== product.sku) {
      const skuDuplicate = await ProductModel.findOne({
        sku,
        store: storeId,
        _id: { $ne: productId },
      });
      if (skuDuplicate) {
        return res.status(409).json({
          success: false,
          message: "Another product with this SKU exists",
        });
      }
      product.sku = sku;
    }

    // Update fields
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (price !== undefined) product.price = Number(price);
    if (cost !== undefined) product.cost = Number(cost);
    if (unit !== undefined) product.unit = unit;
    if (stock !== undefined) product.stock = Number(stock);
    if (reorderLevel !== undefined) product.reorderLevel = Number(reorderLevel);
    if (leadTimeDays !== undefined) product.leadTimeDays = Number(leadTimeDays);
    if (location !== undefined) product.location = location;
    // if (avgDailySales !== undefined)
    //   product.avgDailySales = Number(avgDailySales);
    if (metadata !== undefined) product.metadata = metadata;
    if (isActive !== undefined) product.isActive = isActive;

    // Update supplier (FIXED)
    if (supplier !== undefined) {
      const normalized = normalizeSupplier(supplier, storeId);
      if (normalized) {
        product.supplier = normalized as any;
      } else {
        // If supplier is being cleared
        product.supplier = undefined as any;
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Update Product Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// GET SINGLE PRODUCT
export const getEachProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await ProductModel.findOne({
      _id: productId,
      store: storeId,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;

    const categories = await ProductModel.aggregate([
      {
        $match: {
          store: storeId,
          category: { $exists: true, $ne: null || "" },
        },
      },
      { $group: { _id: "$category" } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};
