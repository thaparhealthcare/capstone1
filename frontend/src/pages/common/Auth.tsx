import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { userContext } from "@/store/userContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../lib/utils";

interface SignupFormData {
  name: string;
  password: string;
}

export function Auth() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    password: "",
  });

  const { dispatch } = useContext(userContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await api.post(`/user/login`, formData);
      const { role } = response.data;
      dispatch(response.data);

      navigate(role ? `/app/${role}/dashboard` : "/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative h-screen w-full">
      <ToastContainer />

      {/* 🔹 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("/bg.jpg")` }}
      />

      {/* 🔹 Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20" />

      {/* 🔹 Login Card */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/tiet_logo.jpg"
              alt="TIET Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">TIET MEDIHUB</h1>
              <p className="text-sm text-gray-500">
                Thapar Institute of Engineering & Technology
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Log in</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button>Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
