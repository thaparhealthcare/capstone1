import { Calendar, CheckCircle, Clock, User, XCircle } from "lucide-react";

interface AppointmentCardProps {
  appointment: any;
  onCancel: () => void;
  onComplete: () => void;
}

export default function AppointmentCard({
  appointment,
  onCancel,
  onComplete,
}: AppointmentCardProps) {
  const { student, date, startTime, endTime, reason, status } = appointment;

  const statusColor =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
      ? "bg-red-100 text-red-600"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* TOP ROW */}
      <div className="flex items-start justify-between">
        {/* STUDENT INFO */}
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <User />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {student?.name || "Student"}
            </h3>

            <p className="text-sm text-gray-500">
              Roll No: {student?.rollNumber || "—"}
            </p>

            <p className="text-sm text-gray-500">
              Course: {student?.course || "—"}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${statusColor}`}
        >
          {status}
        </span>
      </div>

      {/* DATE & TIME */}
      <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            {startTime} – {endTime}
          </span>
        </div>
      </div>

      {/* REASON */}
      <div className="mt-4 rounded-xl bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">Reason</p>
        <p className="mt-1 text-sm text-gray-600">{reason || "—"}</p>
      </div>

      {/* ACTIONS */}
      {status === "booked" && (
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <XCircle size={16} />
            Cancel
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            <CheckCircle size={16} />
            Mark Completed
          </button>
        </div>
      )}
    </div>
  );
}
