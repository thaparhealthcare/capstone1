import Button from "@/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { dataPass } from "@/lib/types.ts";
import { api } from "@/lib/utils";
import { prescriptionContext } from "@/store/prescriptionContext";
import { userContext } from "@/store/userContext";
import { ChevronDown } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Access from "../common/access";

const vitals: Array<{
  id: string;
  label: string;
  name: keyof dataPass;
  placeholder: string;
}> = [
  {
    id: "bp",
    label: "Blood Pressure",
    name: "bp",
    placeholder: "Enter Blood Pressure",
  },
  { id: "spo2", label: "SpO2", name: "spo2", placeholder: "Enter SpO2" },
  {
    id: "temperature",
    name: "temperature",
    label: "Temperature",
    placeholder: "Enter Temperature",
  },
  {
    id: "heart_rate",
    label: "Heart Rate",
    name: "heart_rate",
    placeholder: "Enter Heart Rate",
  },
  { id: "bmi", label: "BMI", name: "bmi", placeholder: "Enter BMI" },
  {
    id: "glucose",
    label: "Glucose",
    name: "glucose",
    placeholder: "Enter Glucose",
  },
  {
    id: "respiratory_rate",
    label: "Respiratory Rate",
    name: "respiratory_rate",
    placeholder: "Enter Respiratory Rate",
  },
];

const prescriptionFields = [
  { id: "history", label: "History", placeholder: "Enter medical history" },
  { id: "co", label: "C/o", placeholder: "Enter chief complaints" },
  { id: "allergy", label: "Allergy(s)", placeholder: "Enter allergies" },
  {
    id: "investigation",
    label: "Investigation(s)",
    placeholder: "Enter investigations",
  },
  {
    id: "diagnosis",
    label: "Diagnosis (ICD Code & Description)",
    placeholder: "Enter ICD diagnosis",
  },
  { id: "prognosis", label: "Prognosis", placeholder: "Enter prognosis" },
  {
    id: "advice",
    label: "Doctor’s Advice / Recommendations",
    placeholder: "Enter advice",
  },
];

interface Medicine {
  m_id: string; //fill when we get _id of the medicine from backend
  name: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface InputValue {
  paramedic_notes: string;
  vitals: {
    bp: string;
    spo2: string;
    temperature: string;
    heart_rate: string;
    bmi: string;
    glucose: string;
    respiratory_rate: string;
    pregnant: boolean;
  };
  treatment_plan: {
    history: string;
    co: string;
    allergy: string;
    investigation: string;
    diagnosis: string;
    prognosis: string;
    advice: string;
  };
  medicine: Medicine[];
  referred_outside?: boolean;
  rest_recommendation?: string;
  follow_up_date?: string;
}

export default function Prescribe() {
  const [showAdvice, setShowAdvice] = useState(false);

  const navigate = useNavigate();
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isPharmacyMedicationOpen, setIsPharmacyMedicationOpen] =
    useState(false);

  const { prescription, setPrescription } = useContext(prescriptionContext);
  useEffect(() => {
    if (!prescription || !prescription._id) {
      setShowAdvice(true);
    }
  }, [prescription]);
  useEffect(() => {
    if (!prescription || !prescription._id) return;

    setInputValue((prev) => ({
      ...prev,
      vitals: {
        bp: prescription.bp || "",
        spo2: prescription.spo2 || "",
        temperature: prescription.temperature || "",
        heart_rate: prescription.heart_rate || "",
        pregnant: prescription.pregnant || false,
        bmi: prescription.bmi || "",
        glucose: prescription.glucose || "",
        respiratory_rate: prescription.respiratory_rate || "",
      },
    }));
  }, [prescription]);

  const { user } = useContext(userContext);
  const [inputValue, setInputValue] = useState<InputValue>({
    paramedic_notes: "",
    vitals: {
      bp: prescription.bp || "",
      spo2: prescription.spo2 || "",
      temperature: prescription.temperature || "",
      heart_rate: prescription.heart_rate || "",
      pregnant: prescription.pregnant || false,
      bmi: prescription.bmi || "",
      glucose: prescription.glucose || "",
      respiratory_rate: prescription.respiratory_rate || "",
    },
    treatment_plan: {
      history: "",
      co: "",
      allergy: "",
      investigation: "",
      diagnosis: "",
      prognosis: "",
      advice: "",
    },
    medicine: [
      {
        m_id: "",
        name: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    referred_outside: false,
    rest_recommendation: "",
    follow_up_date: "",
  });

  console.log("Initial input Values : ", inputValue);
  console.log("Prescription : ", prescription);
  console.log("Prescription ID : ", prescription._id);

  async function submitPrescriptionForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("After Final Input Values : ", inputValue);

    try {
      await api.post("/doctor/prescription", {
        prescription_id: prescription._id,
        doctor_id: `Dr. ${user.name}`,
        paramedic_notes: inputValue.paramedic_notes,
        vitals: inputValue.vitals,
        treatment_plan: inputValue.treatment_plan,
        medicine: inputValue.medicine,
        referred_outside: inputValue.referred_outside,
        rest_recommendation: inputValue.rest_recommendation,
        follow_up_date: inputValue.follow_up_date,
      });
      // console.log("API Response: ", response);
      // toast.success(response.data.message);
      setPrescription({
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

      toast.success("Prescription saved successfully");

      setTimeout(() => {
        navigate("/app/doctor/patientqueue", {
          state: { prescription_id: prescription._id },
        });
      }, 1200);
    } catch (error) {
      toast.error("Error while saving prescription details.");
      console.error(error);
    }
  }

  const handleVitalChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [id]: value,
      },
    }));
  };

  async function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const { name, checked } = target;
      setInputValue((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      const { name, value } = target;
      setInputValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string,
  ) => {
    const updatedMedicine = [...inputValue.medicine];
    updatedMedicine[index][field] = value;
    setInputValue((prev) => ({ ...prev, medicine: updatedMedicine }));
  };

  const addMedicine = () => {
    setInputValue((prev) => ({
      ...prev,
      medicine: [
        ...prev.medicine,
        {
          m_id: "",
          name: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const removeMedicine = (index: number) => {
    setInputValue((prev) => ({
      ...prev,
      medicine: prev.medicine.filter((_, i) => i !== index),
    }));
  };

  const [searchResults, setSearchResults] = useState<
    Record<number, { name: string; _id: string; quantity: number }[]>
  >({});

  const [_searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (index: number, query: string) => {
    setSearchQuery(query);
    handleMedicineChange(index, "name", query);

    if (!query.trim()) {
      setSearchResults((prev) => ({ ...prev, [index]: [] })); // Clear results for this input only
      return;
    }

    try {
      const response: any = await api.post("/doctor/search", { query });
      setSearchResults((prev) => ({
        ...prev,
        [index]: response.data.medicines,
      })); // Store per input field
    } catch (error) {
      console.error("Error searching medicine:", error);
    }
  };
  const handleSelectMedicine = (
    index: number,
    medicine: { name: string; _id: string },
  ) => {
    handleMedicineChange(index, "name", medicine.name);
    handleMedicineChange(index, "m_id", medicine._id);
    setSearchResults((prev) => ({ ...prev, [index]: [] })); // Clear results for this specific input
  };
  return (
    <Access text={["doctor"]}>
      <ToastContainer />
      <div className="p-6 bg-zinc-100 ">
        <h1 className="text-4xl font-semibold mb-6 pl-5">
          Patient Prescription
        </h1>
        <div className="space-y-6 bg-white p-8 rounded-2xl">
          <form
            className={`space-y-6 max-w-7xl mx-auto ${
              showAdvice ? "pointer-events-none opacity-40" : ""
            }`}
            onSubmit={submitPrescriptionForm}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Patient Details</h2>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{prescription.name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Roll No/Staff ID</Label>
                  <p className="font-medium">{prescription.roll_no || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Gender</Label>
                  <p className="font-medium">{prescription.gender || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Age</Label>
                  <p className="font-medium">{prescription.age || "-"}</p>
                </div>
                <div className="space-y-1 ">
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{prescription.email || "-"}</p>
                </div>
                <div className="space-y-1 ">
                  <Label className="text-gray-500">Mobile Number</Label>
                  <p className="font-medium">{prescription.mobile_no || "-"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Paramedic Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter paramedic notes"
                  className="h-24"
                  name="paramedic_notes"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Vitals */}
            <Collapsible
              open={isVitalsOpen}
              onOpenChange={setIsVitalsOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">Vitals</h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isVitalsOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  {vitals.map(({ id, label, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        placeholder={placeholder}
                        defaultValue={String(prescription?.[name] ?? "")}
                        onChange={handleVitalChanges}
                      />
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mt-8 ml-2">
                    <input
                      type="checkbox"
                      id="pregnant"
                      className="w-4 h-4"
                      checked={inputValue.vitals.pregnant}
                      onChange={(e) => {
                        setInputValue((prev) => ({
                          ...prev,
                          vitals: {
                            ...prev.vitals,
                            pregnant: e.target.checked,
                          },
                        }));
                      }}
                    />
                    <Label htmlFor="pregnant">Patient is Pregnant?</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Prescription */}
            <Collapsible
              open={isPrescriptionOpen}
              onOpenChange={setIsPrescriptionOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">Prescription</h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isPrescriptionOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  {prescriptionFields.map(({ id, label, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Textarea
                        id={id}
                        placeholder={placeholder}
                        name={`treatment_plan.${id}`}
                        value={(inputValue.treatment_plan as any)[id]}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const key = name.split(".")[1];
                          setInputValue((prevState) => ({
                            ...prevState,
                            treatment_plan: {
                              ...prevState.treatment_plan,
                              [key]: value,
                            },
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* In Pharmacy Medication */}
            <Collapsible
              open={isPharmacyMedicationOpen}
              onOpenChange={setIsPharmacyMedicationOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">
                  In Pharmacy Medication
                </h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isPharmacyMedicationOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Sr No.</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Frequency/Day</TableHead>
                      <TableHead>Duration(Days)</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inputValue.medicine.map((med, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{index + 1}.</td>
                        <td className="border p-2 relative">
                          <input
                            type="text"
                            value={med.name}
                            required
                            onChange={(e) =>
                              handleSearch(index, e.target.value)
                            }
                            placeholder="Enter medicine"
                            className="border rounded px-2 py-1 w-full"
                          />

                          {searchResults[index]?.length > 0 && (
                            <div>
                              <ul className="absolute z-10 bg-white border mt-1 rounded shadow-lg w-full">
                                {searchResults[index].map((medicine) => (
                                  <li
                                    key={medicine._id}
                                    onClick={() =>
                                      handleSelectMedicine(index, medicine)
                                    }
                                    className={`p-2 cursor-pointer hover:bg-gray-200 ${
                                      medicine.quantity == 0 && " text-red-600"
                                    }`}
                                  >
                                    {medicine.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={med.frequency}
                            required
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "frequency",
                                e.target.value,
                              )
                            }
                            placeholder="Enter frequency"
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={med.duration}
                            required
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "duration",
                                e.target.value,
                              )
                            }
                            placeholder="Enter duration"
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            required
                            value={med.instructions}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "instructions",
                                e.target.value,
                              )
                            }
                            placeholder="Enter instructions"
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeMedicine(index);
                            }}
                            type="button"
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Add Medicine Button */}
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="w-full h-full flex justify-center items-center">
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 "
                            onClick={addMedicine}
                          >
                            Add Medicine
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>

            {/* Additional Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="referred_outside"
                  name="referred_outside"
                  onChange={handleChange}
                ></input>
                <Label htmlFor="referred_outside">Referred Outside?</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rest Recommendation */}
                <div className="space-y-2">
                  <Label htmlFor="rest_recommendation">Recommend Rest?</Label>
                  <Textarea
                    id="rest_recommendation"
                    name="rest_recommendation"
                    placeholder={"Enter rest recommendation"}
                    value={inputValue.rest_recommendation || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Follow-Up Date */}
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-Up Date</Label>
                  <div className="w-40">
                    <Input
                      id="follow_up_date"
                      type="date"
                      name="follow_up_date"
                      value={inputValue.follow_up_date || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Details</Button>
            </div>
          </form>
        </div>
      </div>
      {showAdvice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Action Required
            </h2>

            <p className="text-gray-700 mb-4">
              You cannot prescribe directly.
              <br />
              Please select a patient from <b>Patient Queue</b>.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => navigate("/app/doctor/patientqueue")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Go to Patient Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </Access>
  );
}
