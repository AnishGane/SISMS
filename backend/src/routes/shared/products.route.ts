import express from "express";
import {
  createProduct,
  getEachProduct,
  getProducts,
  updateProduct,
} from "../../controller/shared/product.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { searchProducts } from "../../controller/shared/search.controller.js";

const productRoutes = express.Router();

productRoutes.post("/add-product", auth, allowRoles("admin"), createProduct);

// GET all products with pagination, filters, sorting
productRoutes.get("/", auth, getProducts);

productRoutes.get("/:id", auth, getEachProduct);

//PUT /api/products/update/6932eea77a9e7f7e1e427952
productRoutes.put("/update/:id", auth, updateProduct);

// GET /api/products/search?search=notebook
productRoutes.get("/search", auth, searchProducts);

export default productRoutes;
