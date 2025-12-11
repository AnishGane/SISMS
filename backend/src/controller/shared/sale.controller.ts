// import { Request, Response } from "express";
// import ProductModel from "../../models/product.model";

// export const recordSale = async (req: Request, res: Response) => {
//   try {
//     const { productId, quantity } = req.body;

//     const product = await ProductModel.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // Decrease stock
//     product.stock -= Number(quantity);

//     // Push sale record
//     product.salesHistory.push({
//       date: new Date(),
//       qty: quantity,
//     });

//     await product.save();

//     // Update avgDailySales, ROQ, ROP, Stockout date
//     const updatedProduct = await updateInventoryStats(productId);

//     res.json({
//       success: true,
//       message: "Sale recorded",
//       updatedStats: {
//         avgDailySales: updatedProduct.avgDailySales,
//         reorderQuantity: updatedProduct.reorderQuantity,
//         reorderPoint: updatedProduct.reorderPoint,
//         stockoutDate: updatedProduct.stockoutDate,
//       },
//     });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };
