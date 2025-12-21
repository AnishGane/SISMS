import { Request, Response } from "express";
import StaffModel from "../../models/staff.model.js";
import ProductModel from "../../models/product.model.js";
import OrderModel from "../../models/order.model.js";

// GET /admin/dashboard/cards Data
export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id; // admin = store owner

    const staffCount = await StaffModel.countDocuments({ store: storeId });

    const productCount = await ProductModel.countDocuments({ store: storeId });

    const lowStockCount = await ProductModel.countDocuments({
      store: storeId,
      stock: { $lte: 5 },
    });

    // Monthly Sales
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyOrders = await OrderModel.aggregate([
      {
        $match: {
          store: storeId,
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$total" } },
      },
    ]);

    const monthlySales = monthlyOrders[0]?.total || 0;

    // Total Revenue (all orders)
    const totalRevenueAgg = await OrderModel.aggregate([
      { $match: { store: storeId } },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.revenue || 0;

    res.status(200).json({
      success: true,
      data: {
        staffCount,
        productCount,
        lowStockCount,
        monthlySales,
        totalRevenue,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// For bar chart in admin dashboard
export const getStockByCategory = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id;

    const results = await ProductModel.aggregate([
      { $match: { store: storeId } },
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
        },
      },
    ]);

    res.json({
      success: true,
      data: results.map((r) => ({
        category: r._id,
        stock: r.totalStock,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

export const getMonthlySalesChart = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id;

    const data = await OrderModel.aggregate([
      { $match: { store: storeId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: data.map((d) => ({
        month: `${d._id.month}-${d._id.year}`,
        sales: d.sales,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const storeId = req.user.store || req.user._id;

    const recentProducts = await ProductModel.find({ store: storeId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentStockUpdates = await ProductModel.find({ store: storeId })
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentSales = await OrderModel.find({ store: storeId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentStaff = await StaffModel.find({ store: storeId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        recentProducts,
        recentStockUpdates,
        recentSales,
        recentStaff,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

export const getTodaysOverview = async (req: Request, res: Response) => {
  try {
    const storeId = req.user?.store;
    if (!storeId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await OrderModel.aggregate([
      {
        $match: {
          store: storeId,
          createdAt: { $gte: start, $lte: end },
          status: "completed",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          totalOrders: { $addToSet: "$_id" },
          totalItemsSold: { $sum: "$items.qty" },
          staffSet: { $addToSet: "$createdBy" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          ordersCount: { $size: "$totalOrders" },
          itemsSold: "$totalItemsSold",
          activeStaff: { $size: "$staffSet" },
        },
      },
    ]);

    res.json({
      success: true,
      data: result[0] || {
        totalSales: 0,
        ordersCount: 0,
        itemsSold: 0,
        activeStaff: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
