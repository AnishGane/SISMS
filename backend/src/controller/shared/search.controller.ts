import { Request, Response } from "express";
import ProductModel from "../../models/product.model.js";
import { levenshtein } from "../../utils/levenshteinalgo.js";

interface AuthRequest extends Request {
  user?: { _id: string; store?: string };
}

export const searchProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;
    const search = (req.query.search as string)?.trim().toLowerCase() || "";
    const category = (req.query.category as string)?.toLowerCase() || "all";

    if (!search) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required." });
    }

    let allProducts = await ProductModel.find({ store: storeId }).lean();

    // Apply category filter FIRST
    if (category !== "all") {
      allProducts = allProducts.filter(
        (p) => p.category?.toLowerCase() === category
      );
    }

    // Apply fuzzy + substring scoring on filtered products
    const scoredProducts = allProducts.map((p: any) => {
      const name = (p.name || "").toLowerCase();

      let score = name.includes(search)
        ? 0.0
        : levenshtein(search, name) / Math.max(search.length, name.length);
      const threshold = search.length <= 2 ? 0.6 : 0.5;

      return {
        product: p,
        score,
        hasSubstring: name.includes(search),
        threshold,
      };
    });

    const results = scoredProducts
      .filter((r) => r.score <= r.threshold)
      .sort((a, b) => (a.hasSubstring ? -1 : 1) || a.score - b.score)
      .map((r) => r.product);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products match your search.",
      });
    }

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
