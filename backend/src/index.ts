import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import doctorRoutes from "./routes/doctor.js";
import paramedicRoutes from "./routes/paramedics.js";
import user from "./routes/user.js";

import dotenv from "dotenv";
dotenv.config();

console.log("op");
console.log(process.env.MONGODB_URI);
const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "http://localhost:5174",
      "http://localhost:5173",
      "https://hoppscotch.io",
      "https://capstone1-sigma.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/user", user);
app.use("/doctor", doctorRoutes);
app.use("/paramedic", paramedicRoutes);

app.get("/", function (_req, res) {
  res.send({ message: "Hello World" });
});

export { app };
