import user from "../models/user";
import prescription from "../models/prescription";
import { userInterface } from "../types/user";
import { Request, Response } from "express";
import patientQueue from "../models/patientQueue";

export const getCountOfEmployees = async (req: Request, res: Response) => {
  const roles = [
    { category: "doctor", count: 0 },
    { category: "receptionist", count: 0 },
    { category: "paramedic", count: 0 },
    { category: "Other Staff", count: 0 },
  ];
  try {
    let result1 = await user.find(),
      total = 0;
    for (let i = 0; i < 3; i++) {
      const result = await user.find({ role: roles[i].category });
      total += result.length;
      roles[i].count = result.length;
    }
    roles[3].count = result1.length - total;
    res.status(200).json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const pieChartdata = async (req: Request, res: Response) => {
  const data = [
    { name: "Students", value: 0 },
    { name: "Faculty", value: 0 },
    { name: "Others", value: 0 },
  ];
  try {
    const patients = await prescription.find().populate("patient_id");
    let total = 0;
    patients.forEach((patient) => {
      const user: unknown = patient.patient_id;
      if (
        user &&
        (user as userInterface).staffId?.length == 0 &&
        (user as userInterface).roll_no?.length != 0
      ) {
        data[0].value += 1;
      } else if (
        user &&
        (user as userInterface).staffId?.length != 0 &&
        (user as userInterface).roll_no?.length == 0
      ) {
        data[1].value += 1;
      } else {
        data[2].value++;
      }
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getCountOfPatientsOverMonths = async (
  req: Request,
  res: Response
) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = Array(12).fill(0);

    const patients = await prescription.find({
      createdAt: {
        $gte: new Date(`${currentYear}-01-01`),
        $lt: new Date(`${currentYear + 1}-01-01`),
      },
    });

    patients.forEach((patient) => {
      const createdAt = new Date(patient.createdAt);
      if (createdAt.getFullYear() === currentYear) {
        const month = createdAt.getMonth();
        data[month]++;
      }
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getAnalysis = async (req: Request, res: Response) => {
  try {
    const analysis = [
      { name: "total", value: 0 },
      { name: "average", value: 0 },
      { name: "doctors", value: 0 },
      { name: "appointments", value: 0 },
    ];

    const totalPatients = await prescription
      .find({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      })
      .countDocuments();
    analysis[0].value = totalPatients;
    analysis[1].value = Math.round(totalPatients / 30);
    const activeDoctors = await user.countDocuments({ role: "doctor" });
    analysis[2].value = activeDoctors;

    const totalAppointments = await patientQueue.countDocuments();
    analysis[3].value = totalAppointments;

    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
