import express from "express";
import { createProduct } from "../../controller/shared/product.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";

const productRoutes = express.Router();

productRoutes.post("/add-product", auth, allowRoles("admin"), createProduct);

export default productRoutes;
