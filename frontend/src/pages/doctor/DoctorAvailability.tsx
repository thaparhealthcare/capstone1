import { TimeSelect } from "@/components/TimeSelect";
import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface TimeRange {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export default function DoctorAvailability() {
  const [selectedDate, setSelectedDate] = useState("");
  const [isLeave, setIsLeave] = useState(false);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { startTime: "00:00", endTime: "00:00" },
  ]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ---------------- LOAD DATE ---------------- */
  useEffect(() => {
    const date = searchParams.get("date");
    if (date) setSelectedDate(date);
  }, [searchParams]);

  /* ---------------- HELPERS ---------------- */
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  /* ---------------- DATE CHANGE ---------------- */
  const handleDateChange = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      toast.error("Past dates not allowed");
      return;
    }

    setSelectedDate(date);
    setIsLeave(false);
    setTimeRanges([{ startTime: "00:00", endTime: "00:00" }]);
  };

  /* ---------------- SLOT HANDLERS ---------------- */
  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: "00:00", endTime: "00:00" }]);
  };

  const updateTimeRange = (
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const updated = [...timeRanges];
    updated[index][field] = value;
    setTimeRanges(updated);
  };

  const removeTimeRange = (index: number) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  /* ---------------- STRICT OVERLAP CHECK ---------------- */
  const validateSlots = () => {
    const slots = timeRanges.map((s) => ({
      start: toMinutes(s.startTime),
      end: toMinutes(s.endTime),
    }));

    for (const s of slots) {
      if (s.start >= s.end) {
        toast.error("Start time must be before end time");
        return false;
      }
    }

    slots.sort((a, b) => a.start - b.start);

    for (let i = 0; i < slots.length - 1; i++) {
      if (slots[i].end > slots[i + 1].start) {
        toast.error("Time slots are overlapping or duplicate");
        return false;
      }
    }

    return true;
  };

  /* ---------------- SAVE + REDIRECT ---------------- */
  const saveSchedule = async () => {
    if (!selectedDate) {
      toast.warning("Select a date");
      return;
    }

    if (!isLeave && !validateSlots()) return;

    try {
      setLoading(true);

      await api.post("/doctor/availability", {
        date: selectedDate,
        isLeave,
        timeRanges: isLeave ? [] : timeRanges,
      });

      toast.success("Schedule saved successfully");

      // ✅ AUTO REDIRECT TO VIEW PAGE
      setTimeout(() => {
        navigate("/app/doctor/schedule/view");
      }, 800);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-4xl font-semibold mb-8 ml-6">Doctor Schedule</h1>

      <div className="flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 w-full max-w-md">
          <label className="block mb-2 font-medium">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border w-full px-4 py-2 rounded-lg"
          />
        </div>

        {selectedDate && (
          <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="font-semibold">
                Schedule for{" "}
                <span className="text-blue-600">{selectedDate}</span>
              </h2>

              <label className="flex items-center gap-2">
                <span>Available</span>
                <input
                  type="checkbox"
                  checked={isLeave}
                  onChange={(e) => setIsLeave(e.target.checked)}
                />
                <span className="text-red-500">On Leave</span>
              </label>
            </div>

            {!isLeave && (
              <div className="space-y-4">
                {timeRanges.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border p-3 rounded-lg"
                  >
                    <TimeSelect
                      value={slot.startTime}
                      onChange={(v) => updateTimeRange(i, "startTime", v)}
                    />
                    <span>to</span>
                    <TimeSelect
                      value={slot.endTime}
                      onChange={(v) => updateTimeRange(i, "endTime", v)}
                    />
                    {timeRanges.length > 1 && (
                      <button
                        onClick={() => removeTimeRange(i)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addTimeRange}
                  className="text-blue-600 underline text-sm"
                >
                  + Add another time slot
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={saveSchedule}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
