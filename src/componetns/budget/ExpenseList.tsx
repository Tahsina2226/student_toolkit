import axiosInstance from "../../api/axios";
import Swal from "sweetalert2";

interface ExpenseItem {
  _id?: string;
  category: string;
  amount: number;
  date?: string;
  paymentMethod?: string;
  description?: string;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onDeleted: () => void;
}

const ExpenseList = ({ expenses, onDeleted }: ExpenseListProps) => {
  const handleDelete = async (id?: string) => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/expenses/${id}`);
        Swal.fire("Deleted!", "Your expense has been deleted.", "success");
        onDeleted();
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to delete expense. Please try again.",
          "error"
        );
      }
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (expenses.length === 0)
    return (
      <div className="bg-[#FAF9EE] shadow-md mb-6 p-6 border border-[#DCCFC0] rounded-xl text-[#3E4B3E] text-center">
        No expenses recorded yet. Add your first expense to get started!
      </div>
    );

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-[#FAF9EE] shadow-md mb-6 p-6 border border-[#DCCFC0] rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#3E4B3E] text-xl">Expenses</h3>
        <div className="bg-[#3E4B3E]/20 px-3 py-1 rounded-full font-medium text-[#3E4B3E]">
          Total: {formatCurrency(totalExpense)}
        </div>
      </div>
      <ul className="space-y-3">
        {expenses.map((exp) => (
          <li
            key={exp._id}
            className="flex justify-between items-center hover:bg-[#3E4B3E]/10 p-4 border border-[#DCCFC0] rounded-lg transition-colors"
          >
            <div>
              <p className="font-medium text-[#3E4B3E]">{exp.category}</p>
              <p className="font-semibold text-[#3E4B3E]">
                {formatCurrency(exp.amount)}
              </p>
              {exp.date && (
                <p className="text-[#3E4B3E]/80 text-xs">Date: {exp.date}</p>
              )}
              {exp.paymentMethod && (
                <p className="text-[#3E4B3E]/80 text-xs">
                  Method: {exp.paymentMethod}
                </p>
              )}
              {exp.description && (
                <p className="text-[#3E4B3E]/80 text-xs">{exp.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(exp._id)}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white transition-colors"
              aria-label="Delete expense"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-[#3E4B3E]/80 text-sm">
        Showing {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default ExpenseList;
