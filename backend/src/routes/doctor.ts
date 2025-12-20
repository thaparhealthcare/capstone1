import express, { RequestHandler } from "express";
import {
  createPrescription,
  getDoctorAvailability,
  searchMedicine,
  setDoctorAvailability,
} from "../controllers/doctor.js";
import { check } from "../middlewares/auth.js";

const router = express.Router();

router.post("/prescription", createPrescription as RequestHandler);
router.post("/search", searchMedicine as RequestHandler);
router.post("/availability", check, setDoctorAvailability as RequestHandler);
router.get(
  "/:doctorId/availability",
  check,
  getDoctorAvailability as RequestHandler
);

export default router;
