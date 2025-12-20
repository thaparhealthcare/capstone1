interface TimeSelectProps {
  value: string; // "HH:mm"
  onChange: (val: string) => void;
}

export function TimeSelect({ value, onChange }: TimeSelectProps) {
  const [hour = "09", minute = "00"] = value?.split(":") || [];

  return (
    <div className="flex items-center gap-2">
      {/* Hour */}
      <select
        value={hour}
        onChange={(e) => onChange(`${e.target.value}:${minute}`)}
        className="border px-3 py-2 rounded-md"
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const h = String(i).padStart(2, "0");
          return (
            <option key={h} value={h}>
              {h}
            </option>
          );
        })}
      </select>

      <span className="font-medium">:</span>

      {/* Minute */}
      <select
        value={minute}
        onChange={(e) => onChange(`${hour}:${e.target.value}`)}
        className="border px-3 py-2 rounded-md"
      >
        {["00", "15", "30", "45"].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
