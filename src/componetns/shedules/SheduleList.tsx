import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ClassItem {
  _id?: string;
  subject: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface ClassListProps {
  classes: ClassItem[];
  onDeleted: () => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ClassList = ({ classes, onDeleted }: ClassListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ClassItem>>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A2AF9B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    setIsDeleting(id);
    try {
      await axiosInstance.delete(`/classes/${id}`);
      onDeleted();
      MySwal.fire("Deleted!", "Class has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting class:", error);
      MySwal.fire("Error", "Failed to delete class.", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (cls: ClassItem) => {
    MySwal.fire({
      title: "Edit Class?",
      text: `Do you want to edit "${cls.subject}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#A2AF9B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingId(cls._id || null);
        setFormData({ ...cls });
      }
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const getTextColor = (bgColor: string) => {
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  const getCountdown = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const classTime = new Date();
    classTime.setHours(hours, minutes, 0, 0);
    const diff = classTime.getTime() - currentTime.getTime();
    if (diff <= 0) return "Started";
    const hoursLeft = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if (hoursLeft > 0) return `${hoursLeft}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const getAlertClass = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(sh, sm, 0, 0);
    const endDate = new Date();
    endDate.setHours(eh, em, 0, 0);

    if (
      currentTime.getTime() >= startDate.getTime() &&
      currentTime.getTime() <= endDate.getTime()
    )
      return "bg-[#A2AF9B] text-white";
    if (
      currentTime.getTime() >= startDate.getTime() - 5 * 60 * 1000 &&
      currentTime.getTime() < startDate.getTime()
    )
      return "bg-yellow-400 text-gray-800";
    return "bg-[#DCCFC0] text-gray-700";
  };

  const toggleDayExpand = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => {
        const dayClasses = classes.filter((c) => c.day === day);
        const isExpanded = expandedDay === day;
        return (
          <div
            key={day}
            className="bg-[#DCCFC0] shadow-md hover:shadow-lg border border-[#A2AF9B]/30 rounded-xl overflow-hidden transition-all duration-300"
          >
            <div
              className="flex justify-between items-center bg-[#A2AF9B] p-4 text-white cursor-pointer"
              onClick={() => toggleDayExpand(day)}
            >
              <h4 className="font-bold text-lg">{day}</h4>
              <div className="flex items-center">
                <span className="bg-white/20 mr-3 px-2 py-1 rounded-full text-sm">
                  {dayClasses.length}{" "}
                  {dayClasses.length === 1 ? "Class" : "Classes"}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {isExpanded && (
              <div className="bg-[#F8F6F2] p-4">
                {dayClasses.length === 0 ? (
                  <p className="py-4 text-gray-500 text-center">
                    No classes scheduled
                  </p>
                ) : (
                  <div className="space-y-4">
                    {dayClasses.map((cls) => (
                      <div
                        key={cls._id}
                        className="relative shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all"
                        style={{
                          backgroundColor: cls.color,
                          backgroundImage: `linear-gradient(135deg, ${cls.color}99, ${cls.color})`,
                          color: getTextColor(cls.color),
                        }}
                      >
                        <div
                          className={`absolute top-0 left-0 w-2 h-full ${getAlertClass(
                            cls.startTime,
                            cls.endTime
                          )}`}
                        ></div>
                        <div className="ml-2 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getAlertClass(
                                cls.startTime,
                                cls.endTime
                              )}`}
                            >
                              {getCountdown(cls.startTime)}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(cls)}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                                title="Edit class"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cls._id)}
                                disabled={isDeleting === cls._id}
                                className="bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 p-2 rounded-lg transition-colors"
                                title="Delete class"
                              >
                                {isDeleting === cls._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </div>
                          <h5 className="mb-1 font-bold text-lg">
                            {cls.subject}
                          </h5>
                          <p className="mb-1 text-sm">
                            {cls.startTime} - {cls.endTime}
                          </p>
                          <p className="text-sm">
                            Instructor: {cls.instructor}
                          </p>
                          {editingId === cls._id && (
                            <div className="bg-white/90 mt-2 p-4 border-gray-200 border-t rounded-lg">
                              <h6 className="mb-3 font-bold text-gray-700">
                                Edit Class
                              </h6>
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Subject"
                                  value={formData.subject || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      subject: e.target.value,
                                    })
                                  }
                                  className="p-2 border rounded-lg focus:ring-[#A2AF9B] focus:ring-2 w-full"
                                />
                                <input
                                  type="text"
                                  placeholder="Instructor"
                                  value={formData.instructor || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      instructor: e.target.value,
                                    })
                                  }
                                  className="p-2 border rounded-lg focus:ring-[#A2AF9B] focus:ring-2 w-full"
                                />
                                <div className="gap-3 grid grid-cols-2">
                                  <input
                                    type="time"
                                    value={formData.startTime || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        startTime: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg focus:ring-[#A2AF9B] focus:ring-2 w-full"
                                  />
                                  <input
                                    type="time"
                                    value={formData.endTime || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        endTime: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg focus:ring-[#A2AF9B] focus:ring-2 w-full"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() => {
                                      axiosInstance
                                        .put(`/classes/${cls._id}`, formData)
                                        .then(() => {
                                          setEditingId(null);
                                          onDeleted();
                                          MySwal.fire(
                                            "Saved!",
                                            "Class has been updated.",
                                            "success"
                                          );
                                        });
                                    }}
                                    className="bg-[#A2AF9B] hover:bg-[#879882] px-4 py-2 rounded-lg font-medium text-white transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClassList;
