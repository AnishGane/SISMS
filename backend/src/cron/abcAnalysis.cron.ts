import cron from "node-cron";
import runABCAnalysis from "../services/abcAnalysis.service";

export function startABCAnalysisCron() {
  cron.schedule("0 3 * * *", async () => {
    try {
      console.log("Running ABC Analysis...");
      await runABCAnalysis();
      console.log("ABC Analysis completed");
    } catch (err) {
      console.error("ABC Analysis failed:", err);
    }
  });
}
