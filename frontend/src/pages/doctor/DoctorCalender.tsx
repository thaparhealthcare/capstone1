import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface Availability {
  _id: string;
  date: string; // ISO
  isLeave: boolean;
  timeRanges: TimeRange[];
}

export default function DoctorCalendar() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);

  const navigate = useNavigate();

  /* ------------------ FETCH AVAILABILITY ------------------ */
  useEffect(() => {
    api.get(`/doctor/67dc5af231badc239f1e061b/availability`).then((res) => {
      setAvailability(res.data.availability || []);
    });
  }, []);

  /* ------------------ HELPERS ------------------ */
  const toYMD = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getUTCDate()).padStart(2, "0")}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  /* ------------------ MAP AVAILABILITY ------------------ */
  const availabilityMap: Record<string, Availability> = availability.reduce(
    (acc, item) => {
      acc[toYMD(item.date)] = item;
      return acc;
    },
    {} as Record<string, Availability>,
  );

  /* ------------------ DATE CLICK ------------------ */
  const onDateClick = (date: Date) => {
    if (date < today) return;

    const selected = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setSelectedDay(selected);
    setSelectedAvailability(availabilityMap[selected] || null);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="p-6">
      <h1 className="text-4xl font-semibold mb-6 ml-8">My Calendar</h1>

      <div className="flex flex-col justify-center items-center w-full h-full">
        {/* CALENDAR CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-3xl">
          {/* Month Header */}
          <div className="flex justify-between items-center mb-6 px-2">
            <button
              className="text-xl font-bold hover:text-blue-600"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
            >
              ◀
            </button>

            <h2 className="text-lg font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              className="text-xl font-bold hover:text-blue-600"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
            >
              ▶
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center font-semibold text-gray-500">
                {d}
              </div>
            ))}

            {Array(startDay)
              .fill(null)
              .map((_, i) => (
                <div key={i} />
              ))}

            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  i + 1,
                );

                const iso = `${date.getFullYear()}-${String(
                  date.getMonth() + 1,
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                const data = availabilityMap[iso];
                const isPast = date < today;

                let color = "bg-green-100 text-green-700 hover:bg-green-200";
                if (isPast)
                  color = "bg-gray-200 text-gray-400 cursor-not-allowed";
                if (data?.isLeave)
                  color = "bg-red-100 text-red-600 hover:bg-red-200";

                return (
                  <button
                    key={iso}
                    disabled={isPast}
                    onClick={() => onDateClick(date)}
                    className={`h-14 rounded-xl text-sm font-semibold transition ${color}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
          </div>
        </div>

        {/* ---------------- POPUP DIV ---------------- */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">
                Availability for{" "}
                <span className="text-blue-600">{selectedDay}</span>
              </h2>

              {selectedAvailability?.isLeave && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  You are on leave on this day
                </div>
              )}

              {!selectedAvailability?.isLeave && (
                <>
                  {selectedAvailability?.timeRanges?.length ? (
                    <ul className="space-y-2 mb-4">
                      {selectedAvailability.timeRanges.map((t, i) => (
                        <li
                          key={i}
                          className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50"
                        >
                          {t.startTime} – {t.endTime}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                      You are available but no time slots are set
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    navigate(`/app/doctor/availability?date=${selectedDay}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-6 mt-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full" /> Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-400 rounded-full" /> Leave
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full" /> Past
          </span>
        </div>
      </div>
    </div>
  );
}
