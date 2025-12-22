import "dotenv/config";
import { ConnectDB } from "./db/db.js";
import { app } from "./index.js";
import setupCronJobs from "./jobs/cron.js";

console.log("hiii");
const port = process.env.PORT || 4000;

ConnectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on the PORT ${port}`);
      setupCronJobs();
    });
  })
  .catch(() => {
    console.error("Something went wrong while connecting to the server");
  });
