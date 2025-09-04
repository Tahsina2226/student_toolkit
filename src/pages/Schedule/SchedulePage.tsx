import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import ClassForm from "../../componetns/ScheduleForm";
import ClassList from "../../componetns/SheduleList";

interface ClassItem {
  _id?: string;
  subject: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
  userId: string;
}

const SchedulePage = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = "user123";

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get<ClassItem[]>(
        `/classes?userId=${userId}`
      );
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div
      className="px-4 md:px-8 py-8 md:py-10 min-h-screen"
      style={{ backgroundColor: "#DCCFC0" }}
    >
      <div className="space-y-8 mx-auto max-w-7xl">
        <div className="space-y-3 mb-8 text-center">
          <h1 className="font-bold text-[#5A6D57] text-4xl md:text-5xl">
            📅 Class Schedule
          </h1>
          <p className="text-[#7D8A78] text-lg md:text-xl">
            Organize your academic schedule with ease
          </p>
        </div>

        <div className="gap-5 grid grid-cols-1 md:grid-cols-3 mb-8">
          <div
            className="shadow-md p-5 rounded-2xl text-center"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <h3 className="mb-1 font-bold text-[#DCCFC0] text-2xl">
              {classes.length}
            </h3>
            <p className="text-[#F5F2EB]">Total Classes</p>
          </div>

          <div
            className="shadow-md p-5 rounded-2xl text-center"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <h3 className="mb-1 font-bold text-[#DCCFC0] text-2xl">
              {new Set(classes.map((c) => c.day)).size}
            </h3>
            <p className="text-[#F5F2EB]">Days with Classes</p>
          </div>

          <div
            className="shadow-md p-5 rounded-2xl text-center"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <h3 className="mb-1 font-bold text-[#DCCFC0] text-2xl">
              {new Set(classes.map((c) => c.instructor)).size}
            </h3>
            <p className="text-[#F5F2EB]">Different Instructors</p>
          </div>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
          <div
            className="lg:col-span-4 shadow-lg p-6 rounded-2xl"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <div className="flex items-center mb-5 pb-3 border-[#DCCFC0] border-b">
              <div
                className="flex justify-center items-center mr-3 rounded-full w-10 h-10"
                style={{ backgroundColor: "#DCCFC0" }}
              >
                <span className="text-xl">➕</span>
              </div>
              <h2 className="font-semibold text-[#F5F2EB] text-xl">
                Add New Class
              </h2>
            </div>
            <ClassForm onAdded={fetchClasses} userId={userId} />
          </div>

          <div
            className="lg:col-span-8 shadow-lg p-6 rounded-2xl"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-[#DCCFC0] border-b">
              <div className="flex items-center">
                <div
                  className="flex justify-center items-center mr-3 rounded-full w-10 h-10"
                  style={{ backgroundColor: "#DCCFC0" }}
                >
                  <span className="text-xl">📚</span>
                </div>
                <h2 className="font-semibold text-[#F5F2EB] text-xl">
                  Your Classes
                </h2>
              </div>
              <button
                onClick={fetchClasses}
                className="flex items-center hover:opacity-90 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: "#DCCFC0", color: "#5A6D57" }}
              >
                <span className="mr-2">🔄</span> Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div
                  className="border-b-2 rounded-full w-14 h-14 animate-spin"
                  style={{ borderColor: "#DCCFC0" }}
                ></div>
              </div>
            ) : (
              <ClassList classes={classes} onDeleted={fetchClasses} />
            )}
          </div>
        </div>

        {!isLoading && classes.length === 0 && (
          <div
            className="mt-12 p-8 rounded-2xl text-center"
            style={{ backgroundColor: "#A2AF9B" }}
          >
            <div className="opacity-20 mx-auto mb-6 w-32 h-32">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#5A6D57"
                  d="M45.7,-58.2C59.1,-49.6,69.4,-34.4,72.2,-17.3C75,-0.2,70.3,18.8,60.8,34.3C51.3,49.8,37,61.8,20.3,69.3C3.6,76.8,-15.5,79.8,-31.3,73.9C-47.2,68,-59.8,53.2,-67.2,35.7C-74.6,18.2,-76.9,-2.1,-71.8,-19.8C-66.8,-37.6,-54.5,-52.8,-39.5,-61C-24.5,-69.2,-6.8,-70.4,9.2,-67.7C25.2,-65,45.7,-58.4,45.7,-58.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-[#F5F2EB] text-xl">
              No classes yet
            </h3>
            <p className="text-[#DCCFC0]">
              Add your first class to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
