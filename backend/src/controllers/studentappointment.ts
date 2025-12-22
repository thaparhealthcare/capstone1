import { Request, Response } from "express";
import appointment from "../models/appointment";

export const getAppointmentsByStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const appointments = await appointment
    .find({ "student.id": studentId })
    .populate("doctor", "name department")
    .sort({ date: -1 });

  res.json({ success: true, appointments });
};

export const getUpcomingByStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const today = new Date().toISOString().split("T")[0];
  const appointments = await appointment
    .find({
      "student.id": studentId,
      date: { $gte: today },
      status: "booked",
    })
    .populate("doctor", "name department")
    .sort({ date: 1 });

  res.json({ success: true, appointments });
};

export const getPastByStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const today = new Date().toISOString().split("T")[0];
  const appointments = await appointment
    .find({
      "student.id": studentId,
      $or: [{ date: { $lt: today } }, { status: "completed" }],
    })
    .populate("doctor", "name department")
    .sort({ date: -1 });

  res.json({ success: true, appointments });
};
