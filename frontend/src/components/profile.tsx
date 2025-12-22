import React, { useState } from "react";
import { userContext } from "../store/userContext";
import { dataPass, userInterface } from "../lib/types.ts";
import { prescriptionContext } from "../store/prescriptionContext";
//import { useNavigate } from "react-router-dom";

export default function Profile({ children }: { children: React.ReactNode }) {
  //const navigate = useNavigate();
  const [prescription, setPrescription] = useState<dataPass>({
    _id: "",
    name: "",
    email: "",
    gender: "",
    mobile_no: "",
    age: "",
    dob: new Date(),
    addr: "",
    staffId: "",
    roll_no: "",
    hostel: "",
    year: "",
    room_no: "",
    department: "",
    spo2: "",
    bp: "",
    heart_rate: "",
    bmi: "",
    glucose: "",
    respiratory_rate: "",
    pregnant: false,
    prescription: [],
  });
  const [user, dispatch] = useState<userInterface>({
    _id: "",
    name: "",
    email: "",
    gender: "",
    role: "",
    mobile_no: "",
    dob: new Date(),
    addr: "",
    staffId: "",
    roll_no: "",
    hostel: "",
    year: "",
    room_no: "",
    department: "",
    prescription: [],
  });


  return (
    <prescriptionContext.Provider value={{ prescription, setPrescription }}>
      <userContext.Provider value={{ user, dispatch }}>
        {children}
      </userContext.Provider>
    </prescriptionContext.Provider>
  );
}
