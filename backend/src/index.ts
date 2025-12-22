import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.js";
import doctorRoutes from "./routes/doctor.js";
import paramedicRoutes from "./routes/paramedics.js";
import user from "./routes/user.js";

import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Routes
app.use("/user", user);
app.use("/doctor", doctorRoutes);
app.use("/paramedic", paramedicRoutes);
app.use("/admin", adminRoutes);

app.get("/", function (_req, res) {
  res.send({ message: "Hello World" });
});

export { app };
