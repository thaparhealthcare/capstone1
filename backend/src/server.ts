import "dotenv/config";
import { ConnectDB } from "./db/db.js";
import { app } from "./index.js";
import setupCronJobs from "./jobs/cron.js";

const port = process.env.PORT || 8000;

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
