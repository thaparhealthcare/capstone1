"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/Button";
import axios from "axios";
import {  toast } from "react-toastify";
// import { api } from "../../lib/utils";


interface AddAccountFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    gender: string
    position: string
  }

export default function AddAccount() {
    const [formData, setFormData] = useState<AddAccountFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        position: "",
      });


      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
        //   Simply post the form data to create a new account
        //   const response = await api.post(`/user/create`, formData)
        //   console.log("Account created:", response.data)
        //   toast.success("Account created successfully")
        console.log("Submitted Form Data:", formData);
    
          // Clear the form after successful submission
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            gender: "",
            position: "",
          })
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const { response } = error
            if (response) {
              toast.error(response.data.message || "Failed to create account")
            } else {
              toast.error("No response from server")
            }
          } else {
            toast.error("An error occurred")
          }
        }
      }
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    
      return (
        <div className="h-screen w-full">
          <div
            className="h-full w-full fixed flex items-center justify-center p-4 blur-sm z-[10]"
            style={{
              backgroundImage: `url("/bg.jpeg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-6 relative top-[10%] left-[20%] z-[999]">
            <div className="flex items-center gap-3">
              <img src="/tiet_logo.jpg" alt="TIET Logo" width={40} height={40} className="object-contain" />
              <h1 className="text-2xl font-semibold text-gray-800">TIET MEDIHUB</h1>
            </div>
    
            <div>
              <h2 className="text-xl font-medium text-gray-700">Add Account</h2>
            </div>
    
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
    
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
    
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
    
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange(e as any)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={(e) => handleChange(e as any)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>
                      Position
                    </option>
                    <option value="doctor">Doctor</option>
                    {/* <option value="nurse">Nurse</option> */}
                    <option value="admin">Admin</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="pharmacist">Pharmacist</option>
                    {/* <option value="lab_technician">Lab Technician</option> */}
                    <option value="student">Student</option>
                  </select>
                </div>
                
              </div>
              
    
              <Button >
                Create Account
              </Button>
            </form>
          </div>
        </div>
      )
    }
    
    