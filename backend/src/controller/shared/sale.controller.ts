import { Request, Response } from "express";
import SaleModel from "../../models/sale.model.js";

export const getAdminSalesHistory = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id;
    const sales = await SaleModel.find({ store: storeId })
      .populate("soldBy", "name")
      .populate("productId", "name sku")
      .sort({ date: -1 });
    res.json({ status: "success", data: sales });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error in sales" });
  }
};
