import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User", // doctor user
      required: true,
    },

    student: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      name: String,
      rollNumber: String,
      department: String,
      year: String,
      email: String,
      phone: String,
    },
    date: {
      type: String, // YYYY-MM-DD (same as availability)
      required: true,
    },

    startTime: {
      type: String, // 24 HRS format: HH:mm
      required: true,
    },

    endTime: {
      type: String, // 24 HRS format: HH:mm
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Appointment", appointmentSchema);
