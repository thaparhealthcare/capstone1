import { Schema, model } from "mongoose";

const timeRangeSchema = new Schema(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const doctorAvailabilitySchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    isLeave: {
      type: Boolean,
      default: false,
    },

    timeRanges: {
      type: [timeRangeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default model("DoctorAvailability", doctorAvailabilitySchema);
