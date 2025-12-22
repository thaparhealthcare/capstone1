import express, { RequestHandler } from "express";
import {
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  getAllDoctorAppointments,
  getPastAppointments,
  getUpcomingAppointments,
} from "../controllers/appointment.js";
import {
  createPrescription,
  getAllDoctors,
  getDoctorAvailability,
  getDoctorAvailabilityPublic,
  searchMedicine,
  setDoctorAvailability,
} from "../controllers/doctor.js";
import { check } from "../middlewares/auth.js";

const router = express.Router();

router.post("/prescription", createPrescription as RequestHandler);
router.post("/search", check, searchMedicine as RequestHandler);
router.post("/availability", check, setDoctorAvailability as RequestHandler);
router.get(
  "/:doctorId/availability",
  check,
  getDoctorAvailability as RequestHandler
);
router.get("/appointments", check, getAllDoctorAppointments);
router.get("/appointments/upcoming", check, getUpcomingAppointments);
router.get("/appointments/past", check, getPastAppointments);
router.patch(
  "/appointment/:appointmentId/cancel",
  check,
  cancelAppointment as RequestHandler
);
router.patch(
  "/appointment/:appointmentId/complete",
  check,
  completeAppointment as RequestHandler
);

//student routes
router.get("/findalldoctors", getAllDoctors as RequestHandler);
router.get(
  "/public/:doctorId/availability",
  getDoctorAvailabilityPublic as RequestHandler
);
router.post("/appointment/book", bookAppointment as RequestHandler);
export default router;
