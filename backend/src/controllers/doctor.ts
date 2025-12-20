import { Request, Response } from "express";
import doctorAvailability from "../models/doctorAvailability.js";
import medicine from "../models/medicine.js";
import patientQueue from "../models/patientQueue.js";
import prescription from "../models/prescription.js";

export const createPrescription = async (_req: Request, res: Response) => {
  try {
    const {
      prescription_id,
      doctor_id,
      paramedic_notes = "",
      vitals = {},
      treatment_plan = {},
      medicine = [],
      referred_outside = false,
      rest_recommendation = "",
      follow_up_date,
    } = _req.body;

    console.log("Request body:", _req.body);

    await prescription.findOneAndUpdate(
      {
        _id: prescription_id,
      },
      {
        doctor_id,
        paramedic_notes,
        vitals: {
          bp: vitals?.bp || "",
          spo2: vitals?.spo2 || "",
          temperature: vitals?.temperature || "",
          heart_rate: vitals?.heart_rate || "",
          bmi: vitals?.bmi || "",
          glucose: vitals?.glucose || "",
          respiratory_rate: vitals?.respiratory_rate || "",
          pregnant: vitals?.pregnant || false,
        },
        treatment_plan: {
          history: treatment_plan?.history || "",
          co: treatment_plan?.co || "",
          allergy: treatment_plan?.allergy || "",
          investigation: treatment_plan?.investigation || "",
          diagnosis: treatment_plan?.diagnosis || "",
          prognosis: treatment_plan?.prognosis || "",
          advice: treatment_plan?.advice || "",
        },
        medicine: Array.isArray(medicine)
          ? medicine.map((med) => ({
              medicine_id: med.m_id || null,
              medicine_name: med.name,
              frequency: med.frequency || "",
              duration: med.duration || "",
              instructions: med.instructions || "",
            }))
          : [],
        referred_outside,
        rest_recommendation,
        follow_up_date,
      }
    );

    const updatedQueue = await patientQueue.findOneAndUpdate(
      { prescription_id: prescription_id, status: false },
      { status: true },
      { new: true }
    );

    if (!updatedQueue) {
      return res.status(404).json({
        success: false,
        message: "Patient queue not found or already updated",
      });
    }

    res.status(201).json({
      success: true,
      message: "Prescription saved successfully.",
    });
  } catch (error: any) {
    console.error("Error saving prescription:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while saving the prescription. Please try again.",
      error: error.message,
    });
  }
};

export const searchMedicine = async (req: Request, res: Response) => {
  try {
    console.log("hello ji search karlo");

    const { query } = req.body;

    const medicines = await medicine
      .find({
        name: { $regex: `^${query}`, $options: "i" },
      })
      .select("name _id quantity");

    res.status(200).json({ success: true, medicines });
  } catch (error) {
    console.error("Error searching medicine:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const setDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;

    if (!user || user.role !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doctorId = user._id;
    const { date, isLeave = false, timeRanges = [] } = req.body;

    // date must be "YYYY-MM-DD"
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format (YYYY-MM-DD required)",
      });
    }

    if (isLeave && timeRanges.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Leave day cannot have time ranges",
      });
    }

    // Validate 24-hour time
    for (const slot of timeRanges) {
      if (!slot.startTime || !slot.endTime) {
        return res.status(400).json({
          success: false,
          message: "startTime and endTime are required",
        });
      }

      // 24-hour comparison works perfectly
      if (slot.startTime >= slot.endTime) {
        return res.status(400).json({
          success: false,
          message: "startTime must be less than endTime",
        });
      }
    }

    // 🔥 OVERRIDE LOGIC (PROFESSIONAL)
    await doctorAvailability.findOneAndUpdate(
      { doctor: doctorId, date },
      {
        doctor: doctorId,
        date,
        isLeave,
        timeRanges: isLeave ? [] : timeRanges,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Doctor availability saved successfully",
    });
  } catch (error: any) {
    console.error("Error setting availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;

    if (!user || user.role !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doctorId = user._id;

    const availability = await doctorAvailability
      .find({ doctor: doctorId })
      .sort({ date: 1 }); // string sort works for YYYY-MM-DD

    res.status(200).json({
      success: true,
      availability,
    });
  } catch (error: any) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
