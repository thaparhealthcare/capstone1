import { Express } from "express";
import express, { RequestHandler } from "express";
import { getCountOfEmployees,pieChartdata,getCountOfPatientsOverMonths, getAnalysis} from "../controllers/admin";

const router = express.Router();

router.get("/getCountOfEmployees", getCountOfEmployees as RequestHandler);
router.get("/pieChartdata", pieChartdata as RequestHandler);
router.get("/getCountOfPatientsOverMonths", getCountOfPatientsOverMonths as RequestHandler);
router.get("/getAnalysis", getAnalysis as RequestHandler);
export default router as Express;