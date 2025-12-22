import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import Access from "../common/access";

interface MedicineFormData {
  name: string;
  company: string;
  expiry_date: Date;
  price: string;
  quantity: string;
  description: string;
  batch_no: string;
  mfg_date: Date;
}

const initialFormData: MedicineFormData = {
  name: "",
  company: "",
  expiry_date: new Date(),
  price: "",
  quantity: "",
  description: "",
  batch_no: "",
  mfg_date: new Date(),
};

export function AddMedicine() {
  // const [medicines, setMedicines] = useState<MedicineFormData[]>([]);
  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     try {
  //       const res = await api.get("/paramedic/inventory");
  //       const data: any = res.data;
  //       setMedicines(data);
  //     } catch (error) {
  //       console.error("Error fetching medicines:", error);
  //     }
  //   };

  //   fetchMedicines();
  // }, []);

  const [formData, setFormData] = useState<MedicineFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [name]: name.includes("date") ? new Date(value) : value,
    }));
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res: any = await api.post("/paramedic/add-medicine", formData);
    res.data.success
      ? toast.success(res.data.message)
      : toast.error(res.data.message);
    clearForm();
  };

  return (
    <Access text={["paramedic"]}>
      <div className="p-6 bg-zinc-100 h-full">
        <h1 className="text-4xl font-semibold mb-6 pl-5">
          Add / Update Medicine
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="batch_no">Batch Number</Label>
                  <Input
                    id="batch_no"
                    name="batch_no"
                    required
                    value={formData.batch_no}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    required
                    value={formData.expiry_date.toISOString().split("T")[0]}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="mfg_date">Manufacturing Date</Label>
                  <Input
                    id="mfg_date"
                    name="mfg_date"
                    type="date"
                    required
                    value={formData.mfg_date.toISOString().split("T")[0]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 my-8">
              <Button>Save Details</Button>
            </div>
          </form>
        </div>
      </div>
    </Access>
  );
}
