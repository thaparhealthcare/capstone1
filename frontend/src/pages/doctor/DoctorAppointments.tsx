import { doctorAppointmentApi } from "@/api/DoctorAppointment";
import AppointmentCard from "@/components/doctor/AppointmentCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let res;

      if (filter === "all") res = await doctorAppointmentApi.getAll();
      else if (filter === "past") res = await doctorAppointmentApi.getPast();
      else res = await doctorAppointmentApi.getUpcoming();

      setAppointments(res.data.appointments || []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const cancelAppointment = async (id: string) => {
    try {
      await doctorAppointmentApi.cancel(id);
      toast.success("Appointment cancelled");
      loadAppointments();
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const completeAppointment = async (id: string) => {
    try {
      await doctorAppointmentApi.complete(id);
      toast.success("Appointment marked as completed");
      loadAppointments();
    } catch {
      toast.error("Failed to complete appointment");
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">My Appointments</h1>

      {/* FILTER */}
      <div className="mb-8 flex gap-3">
        {["upcoming", "past", "all"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              filter === t
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          No appointments found
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((a) => (
            <AppointmentCard
              key={a._id}
              appointment={a}
              onCancel={() => cancelAppointment(a._id)}
              onComplete={() => completeAppointment(a._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
