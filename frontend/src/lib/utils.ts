import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const api = axios.create({
//   baseURL: "https://capstone1-7iw4.onrender.com",
//   withCredentials: true,
// });

// import axios from "axios";
// import.meta.env.VITE_PRODUCTION ||
const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function isExpired(date: Date): boolean {
  const now = new Date();
  return date < now;
}

function isExpiringSoon(date: Date): boolean {
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  return date <= sixMonthsFromNow;
}

export { isExpired, isExpiringSoon };
