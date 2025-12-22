import Button from "@/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { opdPageInterface, userInterface } from "@/lib/types.ts";
import { ChevronDown } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../lib/utils.ts";
import Access from "../common/access";

const fields = [
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
    id: "heartRate",
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
    id: "respiratoryRate",
    label: "Respiratory Rate",
    name: "respiratory_rate",
    placeholder: "Enter Respiratory Rate",
  },
  {
    id: "pregnant",
    label: "Pregnant",
    name: "pregnant",
    placeholder: "Enter Pregnancy Status",
  },
];

function Opd() {
  const [focus, setFocus] = useState({
    staffId: false,
    roll_no: false,
    mobile_no: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<opdPageInterface>({
    staffId: "",
    roll_no: "",
    addr: "",
    gender: "",
    email: "",
    mobile_no: "",
    age: "",
    hostel: "",
    room_no: "",
    department: "",
    year: "",
    name: "",
    spo2: "",
    bp: "",
    temperature: "",
    heart_rate: "",
    bmi: "",
    glucose: "",
    respiratory_rate: "",
    pregnant: false,
    prescription: [],
  });
  const navigate = useNavigate();
  const [data, setData] = useState<userInterface[]>([]);
  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const response = await api.post("/user/addOpd", formData);
    if (response.status == 200) toast.success(response.data.message);
    else toast.error(response.data.message);

    navigate("/app/receptionist/opdLog");
  }
  async function search(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { name, value } = e.target as HTMLInputElement;
    const response = await api.post("/user/search", { [name]: value });

    setData(response.data);
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue((x) => {
      return { ...x, [e.target.name]: e.target.value };
    });
  }

  return (
    <Access text={["receptionist"]}>
      <ToastContainer />
      <form className="p-6 bg-zinc-100" onSubmit={handle}>
        <h1 className="text-4xl font-semibold mb-6">OPD</h1>
        <div className="space-y-6 bg-white p-8 rounded-2xl">
          <h2 className="text-xl font-medium">Register New Walk-in</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  value={inputValue.staffId}
                  name="staffId"
                  onFocus={() =>
                    setFocus({
                      staffId: true,
                      roll_no: false,
                      mobile_no: false,
                    })
                  }
                  onChange={(e) => {
                    search(e);
                    handleChange(e);
                  }}
                />
              </div>
              {focus.staffId && (
                <Tab
                  data={data}
                  setInputValue={setInputValue}
                  setData={setData}
                />
              )}
            </div>
            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll No.</Label>
                <Input
                  id="rollNo"
                  value={inputValue.roll_no}
                  name="roll_no"
                  onFocus={() =>
                    setFocus({
                      roll_no: true,
                      staffId: false,
                      mobile_no: false,
                    })
                  }
                  onChange={(e) => {
                    search(e);
                    handleChange(e);
                  }}
                />
              </div>
              {focus.roll_no && (
                <Tab
                  data={data}
                  setInputValue={setInputValue}
                  setData={setData}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={inputValue.name}
                name="name"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={inputValue.email}
                name="email"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="relative">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile No.</Label>
                <Input
                  id="mobile"
                  value={inputValue.mobile_no}
                  name="mobile_no"
                  onFocus={() =>
                    setFocus({
                      mobile_no: true,
                      staffId: false,
                      roll_no: false,
                    })
                  }
                  onChange={(e) => {
                    search(e);
                    handleChange(e);
                  }}
                />
              </div>
              {focus.mobile_no && (
                <Tab
                  data={data}
                  setInputValue={setInputValue}
                  setData={setData}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={inputValue.age}
                name="age"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={inputValue.gender}
                name="gender"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={inputValue.department}
                name="department"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={inputValue.year}
                onChange={handleChange}
                name="year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Input
                id="hostel"
                value={inputValue.hostel}
                name="hostel"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNo">Room No.</Label>
              <Input
                id="roomNo"
                value={inputValue.room_no}
                name="room_no"
                onChange={handleChange}
              />
            </div>
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-lg"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
              <h2 className="text-lg font-semibold">Additional</h2>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                {fields.map(({ id, label, placeholder, name }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      placeholder={placeholder}
                      name={name.toLowerCase()}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end">
            <Button>Save Details</Button>
          </div>
        </div>
      </form>
    </Access>
  );
}

export default Opd;

function Tab({
  data,
  setData,
  setInputValue,
}: {
  data: userInterface[];
  setData: React.Dispatch<React.SetStateAction<userInterface[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<opdPageInterface>>;
}): JSX.Element {
  return (
    <div className="absolute overflow-x-hidden h-max overflow-scroll px-2 bg-[#f5f5f5] rounded-lg">
      {data.map((x: userInterface) => (
        <h1
          className="hover:bg-[#ebebeb]"
          onClick={() => {
            setData([]);
            setInputValue(x);
          }}
        >
          {x.name}
        </h1>
      ))}
    </div>
  );
}
