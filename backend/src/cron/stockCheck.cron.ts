import cron from "node-cron";
import { runDailyStockCheck } from "../services/stockAlert.service.js";

// Runs every day at 8:00 AM
export function startStockCheckCron() {
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily stock check...");
    await runDailyStockCheck();
  });
}
