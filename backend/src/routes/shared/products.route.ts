import express from "express";
import {
  createProduct,
  getCategories,
  getEachProduct,
  getProducts,
  updateProduct,
} from "../../controller/shared/product.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { searchProducts } from "../../controller/shared/search.controller.js";
import upload from "../../middlewares/multer.js";

const productRoutes = express.Router();

productRoutes.post(
  "/add-product",
  auth,
  allowRoles("admin"),
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProduct
);

// GET /api/products/search?search=mouse&category=electronics
productRoutes.get("/search", auth, searchProducts);

// GET all products
productRoutes.get("/", auth, getProducts);
productRoutes.get("/categories", auth, getCategories);

productRoutes.get("/:id", auth, getEachProduct);

//PUT /api/products/6932eea77a9e7f7e1e427952
productRoutes.put("/:id", auth, updateProduct);

export default productRoutes;
