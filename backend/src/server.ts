import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { startStockCheckCron } from "./cron/stockCheck.cron.js";
import { startABCAnalysisCron } from "./cron/abcAnalysis.cron.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  console.log("🌱 Starting server...");
  try {
    await connectDB(); // connect to MongoDB
    console.log("✅ MongoDB connected, starting Express server...");

    startStockCheckCron();
    startABCAnalysisCron();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    console.log("⏰ Stock cron started");
  } catch (err: any) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
