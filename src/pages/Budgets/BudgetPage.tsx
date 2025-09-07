import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import IncomeForm from "../../componetns/budget/IncomeForm";
import IncomeList from "../../componetns/budget/IncomeList";
import ExpenseForm from "../../componetns/budget/ExpenseForm";
import ExpenseList from "../../componetns/budget/ExpenseList";
import Summary from "../../componetns/budget/Summary";
import axiosInstance from "../../api/axios";
import { AuthContext } from "../../componetns/context/AuthContext";

const BudgetPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("summary");

  const fetchIncomes = async () => {
    try {
      if (!user) return;
      const res = await axiosInstance.get("/income", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setIncomes(res.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      if (!user) return;
      const res = await axiosInstance.get("/expenses", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIncomes();
      fetchExpenses();
    }
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
            Please login to view and manage your budget.
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

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="bg-[#FAF9EE] px-4 py-8 min-h-screen">
      <div className="bg-[#A2AF9B] shadow-lg mx-auto rounded-xl max-w-4xl overflow-hidden">
        <div className="p-6 text-[#FAF9EE]">
          <h1 className="mb-2 font-bold text-3xl">📊 Budget Tracker</h1>
          <p className="opacity-95 font-medium">
            Manage your finances with ease
          </p>
        </div>

        <div className="flex border-[#FAF9EE] border-b">
          {["summary", "income", "expenses"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === tab
                  ? "text-[#FAF9EE] border-b-2 border-[#FAF9EE]"
                  : "text-[#FAF9EE]/90 hover:text-[#FAF9EE]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "summary" && (
            <div className="mb-8">
              <h2 className="mb-4 font-semibold text-[#FAF9EE] text-xl">
                Financial Overview
              </h2>
              <div className="bg-[#FAF9EE] p-4 rounded-lg text-[#2F3E2F]">
                <Summary incomes={incomes} expenses={expenses} />
              </div>
            </div>
          )}

          {activeTab === "income" && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#FAF9EE] mr-3 rounded-full w-1 h-8"></div>
                <h2 className="font-semibold text-[#2F3E2F] text-xl">Income</h2>
              </div>

              <div className="bg-[#FAF9EE] mb-4 p-4 rounded-lg">
                <IncomeForm onAdded={fetchIncomes} />
              </div>

              <div className="border border-[#FAF9EE] rounded-lg overflow-hidden">
                <IncomeList incomes={incomes} onDeleted={fetchIncomes} />
              </div>
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#FAF9EE] mr-3 rounded-full w-1 h-8"></div>
                <h2 className="font-semibold text-[#2F3E2F] text-xl">
                  Expenses
                </h2>
              </div>

              <div className="bg-[#FAF9EE] mb-4 p-4 rounded-lg">
                <ExpenseForm onAdded={fetchExpenses} />
              </div>

              <div className="border border-[#FAF9EE] rounded-lg overflow-hidden">
                <ExpenseList expenses={expenses} onDeleted={fetchExpenses} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#A2AF9B] p-4 border-[#FAF9EE] border-t">
          <div className="gap-4 grid grid-cols-3 text-[#FAF9EE] text-center">
            <div>
              <p className="font-medium text-sm">Total Income</p>
              <p className="font-semibold">${totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Total Expenses</p>
              <p className="font-semibold">${totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Balance</p>
              <p
                className={`font-semibold ${
                  balance >= 0 ? "" : "text-red-300"
                }`}
              >
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
