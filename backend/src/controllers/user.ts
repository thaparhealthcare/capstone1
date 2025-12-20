import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Queue from "../models/patientQueue.js";
import Prescription from "../models/prescription.js";
import user from "../models/user.js";
import { userInterface } from "../types/user";
import { createToken } from "../utils/jwt.js";

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({ message: "Field is missing" });
    return;
  }
  console.log(name, password);
  const data: userInterface[] = await user.find({ name: name });
  console.log(data[0]);
  const user1 = data[0];
  const secret: any = process.env.secret;
  if (data.length === 0) {
    res.status(401).json({ message: "Name is incorrect" });
    return;
  } else {
    if (!(await bcrypt.compare(password, user1.password))) {
      console.log("wrong");
      res.status(401).json({ message: "Password is incorrect" });
      return;
    }
  }
  res
    .status(200)
    .cookie("token", createToken({ ...user1, password: "" }), {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 1000 * 60 * 60),
    })
    .send(user1);

  console.log("login ho gya", user1.role);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token").send("Logged out");
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      staffId,
      roll_no,
      password,
      role,
      gender,
      mobile_no, // Updated from phno
      dob,
      email,
      addr,
      department,
      room_no,
      hostel,
      year,
    } = req.body;

    console.log("Attempting to register a new user...");

    // Check if user already exists (by email or mobile_no)
    const existingUser = await user.findOne({
      $or: [{ email }, { mobile_no }],
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new user({
      name,
      staffId: role === "staff" ? staffId : undefined, // Only for staff
      roll_no: role === "student" ? roll_no : undefined, // Only for students
      password: hashedPassword,
      role,
      gender,
      mobile_no,
      dob,
      email,
      addr,
      department: role === "staff" ? department : undefined,
      room_no: role === "student" ? room_no : undefined,
      hostel: role === "student" ? hostel : undefined,
      year: role === "student" ? year : undefined,
    });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkLogin = async (req: Request, res: Response) => {
  const token =
    (req.cookies && req.cookies.token) ||
    (req.headers["authorization"]
      ? JSON.parse(req.headers["authorization"])["value"]
      : null);
  const secret: any = process.env.secret;
  //console.log(token);
  try {
    if (!token) {
      res.status(401).json({ message: "No token" });
    } else {
      const data: any = jwt.verify(token, secret);
      res.status(200).json(data["_doc"]);
    }
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const addOpd = async (req: Request, res: Response) => {
  const {
    user_id,
    gender,
    name,
    roll_no,
    staffId,
    email,
    mobile_no,
    age,
    department,
    room_no,
    hostel,
    year,
    temperature,
    bp,
    spo2,
    heart_rate,
    bmi,
    glucose,
    respiratory_rate,
    pregnant,
  } = req.body;
  //console.log(req.body);
  const check = await user.find({ roll_no: roll_no });
  let patient1;
  if (check.length == 0) {
    patient1 = new user({
      name,
      password: "null",
      role: "worker",
      roll_no,
      staffId,
      email,
      mobile_no,
      age,
      department,
      room_no,
      gender: gender,
      hostel,
      year,
      prescription: [],
    });
    await patient1.save();
  }
  const prescription1 = new Prescription({
    patient_id: check.length == 0 ? patient1?._id : check[0]._id,
    paramedic_notes: "",
    vitals: {
      temperature: temperature,
      respiratory_rate: respiratory_rate,
      bp: bp,
      spo2: spo2,
      heart_rate: heart_rate,
      bmi: bmi,
      glucose: glucose,
      pregnant: pregnant === "true",
    },
    prescription: {
      history: "",
      co: "",
      allergy: "",
      diagnosis: "",
      investigation: "",
      prognosis: "",
      advice: "",
    },
    medicine: [],
    date: new Date(),
  });
  await prescription1.save();
  //console.log(prescription1);
  await user.updateOne(
    { _id: check.length == 0 ? patient1?._id : check[0]._id },
    { $push: { prescription: prescription1._id } }
  );
  //console.log(patient1);
  const queue = new Queue({
    patient_id: check.length == 0 ? patient1?._id : check[0]._id,
    status: false,
    prescription_id: prescription1._id,
  });
  await queue.save();
  res.status(200).json({ message: "Patient added to Queue" });
};

export const getOpdLog = async (req: Request, res: Response) => {
  const status = req.query.status;
  const data = await Queue.find({ status: status })
    .populate("prescription_id")
    .populate("patient_id");
  //console.log(data);
  res.status(200).json(data);
};

export const search = async (req: Request, res: Response) => {
  const { roll_no, staffId, mobile_no } = req.body;
  console.log(await user.find({ mobile_no: "" }));
  const data = await user.find({
    $or: [
      { roll_no: { $regex: roll_no ? roll_no : "-1" } },
      { staffId: { $regex: staffId ? staffId : "-1" } },
      { mobile_no: { $regex: mobile_no ? mobile_no : "-1" } },
    ],
  });
  console.log("hello", data);
  res.status(200).json(data);
};
