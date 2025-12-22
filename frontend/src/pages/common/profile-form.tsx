import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/myprofilecomponents/ui/avatar";
import { Button } from "@/components/myprofilecomponents/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userContext } from "@/store/userContext";
import { User } from "lucide-react";
import type React from "react";
import { useContext, useState } from "react";
// import { userInterface } from "@/lib/types";

// interface UserType {
//     _id: string;
//     name: string;
//     email: string;
//     gender: string;
//     role: string;
//     phno: number;
//     dob: Date;
//     addr: string;
//     staff_id: string;
//     roll_no: string;
//     specialization?: string; // Optional for doctors
//   }

export default function ProfileForm() {
  const { user } = useContext(userContext);
  const role = user?.role;
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phno: user?.mobile_no?.toString() || "",
    email: user?.email || "",
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    addr: user?.addr || "",
    // specialization: user?.specialization || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL for the selected image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Make an API call to update user profile details here
  };
  const handleUpdatePicture = () => {};
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <Avatar className="h-24 w-24">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Profile" />
            ) : (
              <>
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile"
                />
                <AvatarFallback>
                  <User size={40} />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-medium">{user?.name || "User"}</h2>
          <p className="text-gray-500">{role}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="secondary" className="relative">
              Choose File
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </div>
          <div className="text-gray-500 text-sm">
            {selectedFile ? selectedFile.name : "No File Chosen"}
          </div>
          <Button
            variant="default"
            className="bg-[#2a6395] hover:bg-[#1e4d78]"
            onClick={handleUpdatePicture}
          >
            Update Picture
          </Button>
        </div>
      </div>

      {/*-------------Extra Code For Image ---------------------- */}
      {/* <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <Avatar className="h-24 w-24">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Profile" />
            ) : (
              <>
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                <AvatarFallback>
                  <User size={40} />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-medium">{user?.name || "User"}</h2>
          <p className="text-gray-500 capitalize">{role}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="secondary" className="relative">
              Choose File
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </div>
          <div className="text-gray-500 text-sm">
            {selectedFile ? selectedFile.name : "No File Chosen"}
          </div>
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phno">Mobile</Label>
            <Input
              id="phno"
              name="phno"
              value={formData.phno}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date Of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr">Address</Label>
            <Input
              id="addr"
              name="addr"
              value={formData.addr}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#2a6395] hover:bg-[#1e4d78]">
            Update Information
          </Button>
        </div>
      </form>
    </div>
  );
}
