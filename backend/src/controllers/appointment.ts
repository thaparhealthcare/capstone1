import { RequestHandler } from "express";

import Appointment from "../models/appointment";
import doctorAvailability from "../models/doctorAvailability";

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  return date.getDay();
};

export const bookAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { doctorId, date, startTime, endTime, reason, student } = req.body;

    // --- 1. Basic Validation ---
    if (
      !doctorId ||
      !student ||
      !student.id ||
      !date ||
      !startTime ||
      !endTime ||
      !reason
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    if (toMinutes(startTime) >= toMinutes(endTime)) {
      res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
      return;
    }

    // --- 1.5 CHECK: EXISTING PENDING APPOINTMENT ---
    // Agar student ka koi bhi appointment "booked" status mein hai, toh naya book mat karne do
    const existingAppointment = await Appointment.findOne({
      "student.id": student.id,
      status: "booked",
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message:
          "You already have a pending appointment. Please complete or cancel it first.",
      });
      return;
    }

    // --- 2. Availability Check (Leave & Slots) ---
    const availability = await doctorAvailability.findOne({
      doctor: doctorId,
      date,
    });

    // Check A: Leave
    if (availability && availability.isLeave) {
      res.status(400).json({
        success: false,
        message: "Doctor is on leave on this date.",
      });
      return;
    }

    const reqStart = toMinutes(startTime);
    const reqEnd = toMinutes(endTime);

    // Check B: Specific Slots
    if (
      availability &&
      availability.timeRanges &&
      availability.timeRanges.length > 0
    ) {
      const fitsInSlot = availability.timeRanges.some((slot: any) => {
        return (
          reqStart >= toMinutes(slot.startTime) &&
          reqEnd <= toMinutes(slot.endTime)
        );
      });

      if (!fitsInSlot) {
        const availableSlots = availability.timeRanges
          .map((s: any) => `${s.startTime} to ${s.endTime}`)
          .join(", ");

        res.status(400).json({
          success: false,
          message: "Selected time is outside available slots.",
          suggestion: `Available slots: ${availableSlots}`,
        });
        return;
      }
    }
    // Check C: OPD Timings
    else {
      const day = getDayOfWeek(date);
      let isWithinOPD = false;
      let suggestionMsg = "";

      if (day >= 1 && day <= 5) {
        if (reqStart >= toMinutes("08:30") && reqEnd <= toMinutes("18:00"))
          isWithinOPD = true;
        else suggestionMsg = "08:30 AM to 06:00 PM";
      } else if (day === 6) {
        const m =
          reqStart >= toMinutes("10:00") && reqEnd <= toMinutes("14:00");
        const e =
          reqStart >= toMinutes("15:00") && reqEnd <= toMinutes("19:00");
        if (m || e) isWithinOPD = true;
        else suggestionMsg = "10-2 PM or 3-7 PM";
      } else if (day === 0) {
        if (reqStart >= toMinutes("10:00") && reqEnd <= toMinutes("14:00"))
          isWithinOPD = true;
        else suggestionMsg = "10:00 AM to 02:00 PM";
      }

      if (!isWithinOPD) {
        res.status(400).json({
          success: false,
          message: "Time is outside Hospital OPD timings.",
          suggestion: `Please choose between: ${suggestionMsg}`,
        });
        return;
      }
    }

    // --- 4. Create Appointment ---
    const appointment = await Appointment.create({
      doctor: doctorId,
      student,
      date,
      startTime,
      endTime,
      reason,
      status: "booked",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- HELPERS ---------------- */
const todayStr = () => {
  const d = new Date();
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

/* ---------------- GET ALL ---------------- */
export const getAllDoctorAppointments: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const doctorId = req.body.userId;

    console.log(doctorId);
    if (!doctorId) {
      console.log("doctor heni");
    }
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("student", "name rollNumber email")
      .sort({ date: 1, startTime: 1 });
    console.log(appointments);
    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET UPCOMING ---------------- */
export const getUpcomingAppointments: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const doctorId = req.body.userId;

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: todayStr() },
      status: "booked",
    })
      .populate("student", "name rollNumber")
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET PAST ---------------- */
export const getPastAppointments: RequestHandler = async (req, res, next) => {
  try {
    const doctorId = req.body.userId;

    const appointments = await Appointment.find({
      doctor: doctorId,
      $or: [
        { date: { $lt: todayStr() } },
        { status: { $in: ["completed", "cancelled"] } },
      ],
    })
      .populate("student", "name rollNumber")
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (err) {
    next(err);
  }
};

/* ---------------- CANCEL ---------------- */
export const cancelAppointment: RequestHandler = async (req, res, next) => {
  try {
    const doctorId = req.body.user?._id;
    const { appointmentId } = req.params;

    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized doctor" });
      return;
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------- COMPLETE ---------------- */
export const completeAppointment: RequestHandler = async (req, res, next) => {
  try {
    const doctorId = req.body.user?._id; // ✅ FIX
    const { appointmentId } = req.params;

    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized doctor" });
      return;
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment marked as completed",
    });
  } catch (err) {
    next(err);
  }
};
