import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";

interface FormData {
  subject: string;
  topic: string;
  priority: "low" | "medium" | "high";
  day: string;
  startTime: string;
  durationMinutes: number;
  deadline: string;
}

interface Props {
  onAdded: () => void;
  initialData?: Partial<FormData>;
}

const StudyForm = ({ onAdded, initialData }: Props) => {
  const [form, setForm] = useState<FormData>({
    subject: initialData?.subject || "",
    topic: initialData?.topic || "",
    priority: initialData?.priority || "medium",
    day: initialData?.day || "",
    startTime: initialData?.startTime || "",
    durationMinutes: initialData?.durationMinutes || 30,
    deadline: initialData?.deadline || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (form.durationMinutes <= 0)
      newErrors.durationMinutes = "Duration must be greater than 0";
    if (form.deadline) {
      const deadlineDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today)
        newErrors.deadline = "Deadline cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
    setForm((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (initialData && initialData.subject) {
        await axiosInstance.put(`/study/${initialData.subject}`, form);
      } else {
        await axiosInstance.post("/study", form);
      }
      setForm({
        subject: "",
        topic: "",
        priority: "medium",
        day: "",
        startTime: "",
        durationMinutes: 30,
        deadline: "",
      });
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add/update study plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center bg-[#FAF9EE] px-4 py-8">
      <div className="bg-[#A2AF9B] shadow-lg rounded-xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 text-[#FAF9EE]">
          <h2 className="font-bold text-xl">
            📚 {initialData ? "Edit Study Plan" : "Create New Study Plan"}
          </h2>
          <p className="opacity-90 text-xs">
            Organize your study schedule effectively
          </p>
        </div>

        <div className="bg-white p-6">
          <form
            onSubmit={handleSubmit}
            className="gap-6 grid grid-cols-1 md:grid-cols-2"
          >
            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                placeholder="e.g., Mathematics"
                value={form.subject}
                onChange={handleChange}
                className={`px-4 py-3 border rounded-lg w-full focus:ring-2 focus:ring-[#3E4B3E] focus:border-[#3E4B3E] transition ${
                  errors.subject ? "border-red-500" : "border-[#3E4B3E]"
                }`}
              />
              {errors.subject && (
                <p className="mt-1 text-red-500 text-sm">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                placeholder="e.g., Calculus"
                value={form.topic}
                onChange={handleChange}
                className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Day of Study
              </label>
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
              >
                <option value="">Select a day</option>
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="px-4 py-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="durationMinutes"
                min={1}
                value={form.durationMinutes}
                onChange={handleChange}
                className={`px-4 py-3 border rounded-lg w-full focus:ring-2 focus:ring-[#3E4B3E] focus:border-[#3E4B3E] transition ${
                  errors.durationMinutes ? "border-red-500" : "border-[#3E4B3E]"
                }`}
              />
              {errors.durationMinutes && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.durationMinutes}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className={`px-4 py-3 border rounded-lg w-full focus:ring-2 focus:ring-[#3E4B3E] focus:border-[#3E4B3E] transition ${
                  errors.deadline ? "border-red-500" : "border-[#3E4B3E]"
                }`}
              />
              {errors.deadline && (
                <p className="mt-1 text-red-500 text-sm">{errors.deadline}</p>
              )}
            </div>

            <div className="flex gap-3 md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3E4B3E] hover:opacity-90 shadow-md"
                }`}
              >
                {isSubmitting
                  ? initialData
                    ? "Updating..."
                    : "Adding..."
                  : initialData
                  ? "Update Study Plan"
                  : "Add Study Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyForm;
