import cron from "node-cron";
import Appointment from "../models/appointment";

const setupCronJobs = () => {
  // Schedule: Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running Cron Job: Deleting old pending appointments...");

    try {
      const now = new Date();

      // 1. Calculate Date for 2 Days Ago
      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - 2); // Current Date - 2 Days

      // 2. Format to String (YYYY-MM-DD)
      const year = pastDate.getFullYear();
      const month = String(pastDate.getMonth() + 1).padStart(2, "0");
      const day = String(pastDate.getDate()).padStart(2, "0");
      const cutoffDateStr = `${year}-${month}-${day}`;

      // --- LOGIC ---
      // Hume wo appointments delete karni hain jo:
      // 1. Status abhi bhi "booked" hai (matlab attend nahi hui)
      // 2. Date 2 din pehle ki (ya usse purani) hai

      const result = await Appointment.deleteMany({
        status: "booked", // Sirf pending/missed appointments delete karega
        date: { $lte: cutoffDateStr }, // Less than or Equal to 2 days ago
      });

      if (result.deletedCount > 0) {
        console.log(
          `Deleted ${result.deletedCount} old appointments (older than 2 days).`
        );
      } else {
        console.log("No old appointments found to delete.");
      }
    } catch (error) {
      console.error("Error in Cron Job:", error);
    }
  });
};

export default setupCronJobs;
