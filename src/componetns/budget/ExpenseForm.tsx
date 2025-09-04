import { useState } from "react";
import axiosInstance from "../../api/axios";

interface ExpenseFormProps {
  onAdded: () => void;
}

const ExpenseForm = ({ onAdded }: ExpenseFormProps) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleAdd = async () => {
    if (!category || !amount)
      return alert("Please fill in all required fields!");
    setIsLoading(true);
    try {
      await axiosInstance.post("/expenses", {
        category,
        amount: Number(amount),
        date: date || new Date().toISOString().split("T")[0],
        description,
        paymentMethod,
      });
      setCategory("");
      setAmount("");
      setDate("");
      setDescription("");
      setPaymentMethod("cash");
      onAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Housing",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Education",
    "Travel",
    "Other",
  ];

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "digital_wallet", label: "Digital Wallet" },
  ];

  return (
    <div className="bg-[#A2AF9B] shadow-md mb-6 p-6 border border-[#DCCFC0] rounded-xl">
      <h3 className="flex items-center mb-4 font-semibold text-[#3E4B3E] text-xl">
        <span className="bg-[#DCCFC0] mr-3 p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-[#3E4B3E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        Add New Expense
      </h3>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full text-[#3E4B3E] transition-colors"
          >
            <option value="">Select a category</option>
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full text-[#3E4B3E] transition-colors"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full text-[#3E4B3E] transition-colors"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full text-[#3E4B3E] transition-colors"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-[#3E4B3E] text-sm">
            Description (Optional)
          </label>
          <textarea
            placeholder="Add any notes about this expense"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="p-3 border border-[#3E4B3E] focus:border-[#3E4B3E] rounded-lg focus:ring-[#3E4B3E] focus:ring-2 w-full text-[#3E4B3E] transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={isLoading || !category || !amount}
        className={`mt-4 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
          isLoading || !category || !amount
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#3E4B3E] text-[#FAF9EE] hover:opacity-90 shadow-md"
        }`}
      >
        {isLoading ? "Adding..." : "Add Expense"}
      </button>
    </div>
  );
};

export default ExpenseForm;
