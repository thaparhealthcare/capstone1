import cron from "node-cron";
import Appointment from "../models/appointment";

const setupCronJobs = () => {

  cron.schedule("*/30 * * * *", async () => {
    console.log("Running Cron Job: Deleting old pending appointments...");

    try {
      const now = new Date();


      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - 2);


      const year = pastDate.getFullYear();
      const month = String(pastDate.getMonth() + 1).padStart(2, "0");
      const day = String(pastDate.getDate()).padStart(2, "0");
      const cutoffDateStr = `${year}-${month}-${day}`;


      const result = await Appointment.deleteMany({
        status: "booked",
        date: { $lte: cutoffDateStr }, 
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
