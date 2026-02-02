import { Request, Response } from "express";
import ProductModel from "../../models/product.model.js";

export const getABCStats = async (req: Request, res: Response) => {
  const storeId = req.user!.store || req.user!._id;

  const stats = await ProductModel.aggregate<{
    _id: "A" | "B" | "C" | null;
    count: number;
  }>([
    { $match: { store: storeId } },
    {
      $group: {
        _id: "$abcClass",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { A: 0, B: 0, C: 0 };
  for (const s of stats) {
    if (s._id === "A" || s._id === "B" || s._id === "C") {
      result[s._id] = s.count;
    }
  }

  res.json(result);
};
