import Button from "@/components/Button";
import { api } from "@/lib/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Access from "../common/access";

interface MedicineFormData {
  _id: string;
  name: string;
  company: string;
  expiry_date: string;
  price: string;
  quantity: string;
  description: string;
  batch_no: string;
  mfg_date: string;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineFormData[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get("/paramedic/inventory");
        const data: any = res.data;
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <Access text={["admin", "paramedic"]}>
      <div className="p-6 bg-zinc-100 h-full">
        <h1 className="text-4xl font-semibold mb-6 pl-5">Inventory</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Sr No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Batch No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Price (Rs.)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {medicines.map((medicine, i) => (
                  <tr key={medicine._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {medicine.batch_no}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {medicine.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {medicine.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {moment(medicine.expiry_date).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        onClick={() =>
                          navigate("/app/paramedic/medicine-info", {
                            state: medicine,
                          })
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Access>
  );
}
