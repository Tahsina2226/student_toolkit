import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SchedulePage from "../pages/Schedule/SchedulePage";
import BudgetPage from "@/pages/Budgets/BudgetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/schedule", element: <SchedulePage /> },
      { path: "/budget", element: <BudgetPage /> },
    ],
  },
]);
