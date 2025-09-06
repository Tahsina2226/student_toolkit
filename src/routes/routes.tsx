import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import SchedulePage from "../pages/Schedule/SchedulePage";
import BudgetPage from "@/pages/Budgets/BudgetPage";
import ExamQA from "@/pages/ExamQA/ExamQA";
import StudyPlannerPage from "@/pages/study/StudyPlannerPage";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Login/Register";
import Motivation from "@/pages/motivation/Motivation"; // capitalized

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/schedule", element: <SchedulePage /> },
      { path: "/budget", element: <BudgetPage /> },
      { path: "/exam", element: <ExamQA /> },
      { path: "/planner", element: <StudyPlannerPage /> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/motivation", element: <Motivation /> },
    ],
  },
]);
