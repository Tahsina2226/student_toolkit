import { useState } from "react";
import axiosInstance from "../api/axios";

interface ClassFormProps {
  onAdded: () => void;
  userId: string;
}

const ClassForm = ({ onAdded, userId }: ClassFormProps) => {
  const [form, setForm] = useState({
    subject: "",
    instructor: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    color: "#A2AF9B",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!form.subject || !form.instructor || !form.startTime || !form.endTime) {
      alert("All fields are required!");
      return;
    }
    if (form.startTime >= form.endTime) {
      alert("Start time must be earlier than end time!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/classes", { ...form, userId });
      setForm({
        subject: "",
        instructor: "",
        day: "Monday",
        startTime: "",
        endTime: "",
        color: "#A2AF9B",
      });
      onAdded();
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Failed to add class!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="bg-gradient-to-br from-[#DCCFC0] to-[#A2AF9B] shadow-lg mb-8 p-8 rounded-2xl w-full h-[650px]">
      <h2 className="flex items-center mb-8 font-bold text-gray-800 text-2xl">
        <svg
          className="mr-2 w-7 h-7"
          fill="none"
          stroke="#5A6D57"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Add a New Class
      </h2>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8">
        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter subject name"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="bg-white/90 p-4 border border-[#A2AF9B] focus:border-[#A2AF9B] rounded-xl focus:ring-[#A2AF9B] focus:ring-2 w-full transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            Instructor
          </label>
          <input
            type="text"
            placeholder="Enter instructor name"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="bg-white/90 p-4 border border-[#A2AF9B] focus:border-[#A2AF9B] rounded-xl focus:ring-[#A2AF9B] focus:ring-2 w-full transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            Day
          </label>
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="bg-white/90 p-4 border border-[#A2AF9B] focus:border-[#A2AF9B] rounded-xl focus:ring-[#A2AF9B] focus:ring-2 w-full transition-all"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            Start Time
          </label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="bg-white/90 p-4 border border-[#A2AF9B] focus:border-[#A2AF9B] rounded-xl focus:ring-[#A2AF9B] focus:ring-2 w-full transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            End Time
          </label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="bg-white/90 p-4 border border-[#A2AF9B] focus:border-[#A2AF9B] rounded-xl focus:ring-[#A2AF9B] focus:ring-2 w-full transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-700 text-sm">
            Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="shadow-md p-0 border-2 border-white rounded-lg w-14 h-14 hover:scale-105 transition-transform cursor-pointer"
            />
            <span className="bg-white/70 px-3 py-1.5 rounded-lg font-medium text-gray-700 text-sm">
              {form.color}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={isSubmitting}
        className="flex justify-center items-center bg-gradient-to-r from-[#DCCFC0] to-[#A2AF9B] disabled:opacity-70 shadow-md hover:shadow-lg px-8 py-4 rounded-xl w-full font-semibold text-white text-lg transition-all duration-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg
              className="mr-2 -ml-1 w-6 h-6 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg
              className="mr-2 w-6 h-6"
              fill="none"
              stroke="#5A6D57"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add Class
          </>
        )}
      </button>
    </div>
  );
};

export default ClassForm;
