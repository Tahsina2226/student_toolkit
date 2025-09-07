import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../componetns/context/AuthContext";
import MotivationCard from "../../componetns/motivation/MotivationCard";

export default function Motivation() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
            Please login to view motivational content.
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
    <div>
      <MotivationCard />
    </div>
  );
}
