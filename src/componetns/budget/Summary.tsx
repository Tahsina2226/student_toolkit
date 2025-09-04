import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SummaryProps {
  incomes?: { amount: number }[];
  expenses?: { amount: number }[];
}

const Summary = ({ incomes = [], expenses = [] }: SummaryProps) => {
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const data = [
    {
      name: "Finance",
      Income: totalIncome,
      Expenses: totalExpenses,
      Balance: balance,
    },
  ];

  return (
    <div className="bg-[#FAF9EE] shadow-md p-6 rounded-lg text-[#2F3E2F]">
      <h2 className="mb-4 font-bold text-xl">💰 Financial Summary</h2>
      <div className="gap-4 grid grid-cols-3 mb-6 text-center">
        <div className="bg-[#DCCFC0] p-3 rounded-lg">
          <p className="font-medium text-sm">Total Income</p>
          <p className="font-semibold">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-[#DCCFC0] p-3 rounded-lg">
          <p className="font-medium text-sm">Total Expenses</p>
          <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            balance >= 0 ? "bg-[#DCCFC0]" : "bg-red-200"
          }`}
        >
          <p className="font-medium text-sm">Balance</p>
          <p className="font-semibold">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Income" fill="#3E4B3E" />
            <Bar dataKey="Expenses" fill="#D9534F" />
            <Line
              type="monotone"
              dataKey="Balance"
              stroke="#FFA500"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Summary;
