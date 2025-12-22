import { Button } from "@/components/myprofilecomponents/ui/button";
import { api } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Check, Printer } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface StateMedicineTypes {
  medicine_id: string;
  medicine_name: string;
  duration: number;
  frequency: number;
  instructions: string;
}

export default function PrescriptionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const patient = {
    name: state.patient_id.name,
    rollNumber: state.patient_id.roll_no || state.patient_id.staffId,
    age: state.patient_id.age,
    phone: state.patient_id.mobile_no,
    prescribedBy: state.prescription_id.doctor_id,
    prescriptionDate: moment(state.prescription_id.date).format("DD-MM-YYYY"),
    notes: state.prescription_id.paramedic_notes,
    medicines: state.prescription_id.medicine,
  };

  const pdfRef = useRef(null);

  const generatePDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element!);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${patient.prescriptionDate}_${patient.name}.pdf`);
  };

  const [stock, setstock] = useState([]);

  useEffect(() => {
    const medIds = state.prescription_id.medicine.map(
      (med: StateMedicineTypes) => med.medicine_id,
    );

    const fetchStockData = async () => {
      try {
        const response = await api.get("/paramedic/inventory");
        const data: any = response.data;

        const filteredDBStock = data.filter((item: any) =>
          medIds.includes(item._id),
        );

        const stock = state.prescription_id.medicine.map(
          (med: StateMedicineTypes) => {
            const stockItem = filteredDBStock.find(
              (item: any) => item._id === med.medicine_id,
            );
            return {
              ...med,
              available: stockItem.quantity - med.duration >= 0,
            };
          },
        );

        setstock(stock);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  const handleDispense = async () => {
    try {
      const res: any = await api.post("/paramedic/dispatch-medicine", {
        prescription_id: state.prescription_id._id,
        medicines: stock,
      });

      toast.success(res.data.message);
      navigate("/app/paramedic/opdLog");
    } catch (error) {
      console.error("Error dispensing medication:", error);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-4xl bg-zinc-100">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/app/paramedic/opdLog"
          className="flex items-center text-[#1e3a5c] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Prescriptions
        </Link>
        <Button
          onClick={generatePDF}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>

      <div ref={pdfRef}>
        {/* Patient Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5c]">
                Prescription Details
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-2">
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">
                Patient Information
              </h3>
              <div className="space-y-1">
                <p>Name: {patient.name}</p>
                <p>Roll Number: {patient.rollNumber}</p>
                <p>Age: {patient.age}</p>
                <p>Phone: {patient.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">
                Prescription Information
              </h3>
              <div className="space-y-1">
                <p>Prescribed By: {patient.prescribedBy}</p>
                <p>Prescription Date: {patient.prescriptionDate}</p>
                <p>Prescription Notes: {patient.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1e3a5c] mb-4">
            Prescribed Medications
          </h2>

          <div className="space-y-4 mb-6">
            {stock.map((med: any) => (
              <div
                key={med.medicine_id}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h1 className="font-medium">{med.medicine_name}</h1>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          med.available > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {med.available ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Quantity: {med.duration} units</p>
                      <p>Frequency: {med.frequency}</p>

                      {med.instructions && (
                        <p className="text-gray-500 mt-1">
                          Note: {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-sm text-gray-500 mb-2">
              Additional Instructions
            </h3>
            <p>{state.prescription_id.treatment_plan.advice}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end my-5">
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/app/paramedic/opdLog")}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDispense}
            className="bg-[#1e3a5c] hover:bg-[#2a4a6d] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Dispense Medication
          </Button>
        </div>
      </div>
    </main>
  );
}
