import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import StudyForm from "../../componetns/Study/StudyForm";
import StudyList from "../../componetns/Study/StudyList";
import { AuthContext } from "../../componetns/context/AuthContext";

const StudyPlannerPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);

  const fetchPlans = async () => {
    if (!user) return;
    const res = await axiosInstance.get("/study", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPlans(res.data);
  };

  const handleComplete = async (id: string) => {
    if (!user) return;
    await axiosInstance.put(`/study/${id}/complete`, null, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await axiosInstance.delete(`/study/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center bg-[#FAF9EE] min-h-screen">
        <div className="bg-white shadow-2xl p-8 border border-gray-200 rounded-2xl max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="flex justify-center items-center bg-red-100 shadow-md rounded-full w-16 h-16 text-red-500">
              🔒
            </div>
          </div>
          <h2 className="mb-2 font-bold text-gray-800 text-2xl">
            Access Restricted
          </h2>
          <p className="mb-6 text-gray-600">
            Please login to view your study planner.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#A2AF9B] hover:bg-[#8b9a83] shadow-md px-6 py-3 rounded-lg font-semibold text-white transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
