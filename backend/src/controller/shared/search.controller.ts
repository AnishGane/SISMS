import { Request, Response } from "express";
import ProductModel from "../../models/product.model.js";
import { levenshtein } from "../../utils/levenshteinalgo.js";

interface AuthRequest extends Request {
  user?: { _id: string; store?: string };
}

interface Product {
  _id: string;
  name: string;
  store: string;
}

// Define proper types for scored products
interface ScoredProduct {
  product: Product;
  distance: number;
  score: number;
  threshold: number;
  hasSubstring: boolean; // NEW
}

export const searchProducts = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const storeId = req.user.store || req.user._id;
    const search =
      (req.query.search as string | undefined)?.trim().toLowerCase() || "";

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const allProducts = await ProductModel.find({ store: storeId }).lean();

    if (allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in your store.",
      });
    }

    // Hybrid scoring: substring match (priority) + fuzzy fallback
    const scoredProducts: ScoredProduct[] = allProducts.map((p: any) => {
      const name = (p.name || "").toLowerCase();

      // 1. Exact substring match (best score = 0)
      let score = 1.0;
      if (name.includes(search)) {
        score = 0.0; // Perfect substring match
      } else {
        // 2. Fuzzy Levenshtein fallback
        const distance = levenshtein(search, name);
        const maxLen = Math.max(search.length, name.length);
        score = distance / maxLen;
      }

      // Dynamic threshold
      const threshold = search.length <= 2 ? 0.6 : 0.5; // More lenient thresholds

      return {
        product: p as Product,
        distance: score * Math.max(search.length, name.length), // For sorting tiebreaker
        score,
        threshold,
        hasSubstring: name.includes(search),
      };
    });

    const results: ScoredProduct[] = scoredProducts
      .filter((r) => r.score <= r.threshold)
      .sort((a, b) => {
        // Prioritize substring matches, then lower score
        if (a.hasSubstring && !b.hasSubstring) return -1;
        if (!a.hasSubstring && b.hasSubstring) return 1;
        return a.score - b.score;
      });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products match your search.",
        suggestions: scoredProducts.slice(0, 3).map((r) => r.product.name),
      });
    }

    const source = search.length <= 2 ? "short-hybrid" : "hybrid";

    return res.status(200).json({
      success: true,
      source,
      data: results.map((r) => r.product),
      total: results.length,
      message: results.length === 1 ? "" : "Showing best matches:",
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search products.",
    });
  }
};
