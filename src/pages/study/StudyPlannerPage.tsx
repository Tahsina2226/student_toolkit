import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import StudyForm from "../../componetns/Study/StudyForm";
import StudyList from "../../componetns/Study/StudyList";

const StudyPlannerPage = () => {
  const [plans, setPlans] = useState<any[]>([]);

  const fetchPlans = async () => {
    const res = await axiosInstance.get("/study");
    setPlans(res.data);
  };

  const handleComplete = async (id: string) => {
    await axiosInstance.put(`/study/${id}/complete`);
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/study/${id}`);
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="bg-[#FAF9EE] p-8 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 font-bold text-[#2D2A26] text-4xl">
          📖 Study Planner
        </h1>
        <p className="mb-8 text-gray-600">
          Break down your big study goals into smaller, manageable tasks.
        </p>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-2 bg-[#DCCFC0] shadow-lg p-6 rounded-2xl">
            <h2 className="mb-4 font-semibold text-[#2D2A26] text-xl">
              ➕ Add New Plan
            </h2>
            <StudyForm onAdded={fetchPlans} />
          </div>

          <div className="lg:col-span-2 bg-white shadow-lg p-6 rounded-2xl">
            <h2 className="mb-4 font-semibold text-[#2D2A26] text-xl">
              📋 Your Plans
            </h2>
            <StudyList
              plans={plans}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerPage;
