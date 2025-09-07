import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../componetns/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "schedule", label: "Class Schedule", path: "/schedule" },
    { id: "budget", label: "Budget Tracker", path: "/budget" },
    { id: "exam", label: "Exam Generator", path: "/exam" },
    { id: "planner", label: "Study Planner", path: "/planner" },
    { id: "motivation", label: "Motivation & Tips", path: "/motivation" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-gradient-to-r from-[#7D8F69] to-[#A2AF9B] shadow-xl"
          : "py-4 bg-gradient-to-r from-[#8FA37E] to-[#B0BEA9]"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center">
          <div
            className="group flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex justify-center items-center bg-gradient-to-br from-[#E8D7C3] to-[#DCCFC0] shadow-md group-hover:shadow-lg rounded-xl w-12 h-12 group-hover:rotate-12 transition-all duration-500 transform">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-700"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-5 tracking-tight">
                Student<span className="text-[#E8D7C3]">Suite</span>
              </span>
              <span className="opacity-80 mt-1 text-[#E8D7C3] text-xs">
                Academic Tools
              </span>
            </div>
          </div>

          <ul className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-1.5 border border-white/10 rounded-2xl">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 ${
                      isActive
                        ? "bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] text-gray-900 shadow-lg transform -translate-y-0.5"
                        : "text-white hover:bg-white/10 hover:shadow-sm"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {user ? (
              <li className="flex items-center space-x-2 ml-3">
                <div className="relative">
                  <div className="flex justify-center items-center bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] rounded-full w-9 h-9 font-bold text-gray-800 text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="-right-1 -bottom-1 absolute bg-green-500 border-2 border-white rounded-full w-3 h-3"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white text-sm">
                    {user?.name}
                  </span>
                  <span className="text-white/70 text-xs">Student</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center hover:bg-white/10 px-3 py-2 rounded-xl font-medium text-white text-sm transition-all duration-500"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className="flex items-center bg-white/20 hover:bg-white/30 shadow-md hover:shadow-lg px-4 py-2 rounded-xl font-medium text-sm transition-all duration-500"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>

          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <div className="flex justify-center items-center bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] rounded-full w-8 h-8 font-bold text-gray-800 text-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex justify-center items-center bg-white/10 hover:bg-white/20 rounded-lg focus:outline-none w-10 h-10 text-white text-2xl transition-colors"
            >
              {isMenuOpen ? "X" : "≡"}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-2 bg-gradient-to-b from-[#7D8F69] to-[#A2AF9B] shadow-inner px-3 pt-3 pb-5 rounded-b-2xl">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl w-full font-medium text-sm text-left transition-all duration-500 ${
                    isActive
                      ? "bg-white/20 text-white shadow-inner"
                      : "hover:bg-white/10 text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {user ? (
            <li>
              <div className="flex justify-between items-center bg-white/10 px-3 py-3 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] rounded-full w-9 h-9 font-bold text-gray-800 text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white text-sm">
                      {user?.name}
                    </span>
                    <span className="text-white/70 text-xs">
                      Student Account
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="flex items-center hover:bg-white/20 p-2 rounded-lg font-medium text-white text-sm transition-all duration-500"
                >
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex justify-center items-center bg-white/20 hover:bg-white/30 shadow-md hover:shadow-lg px-4 py-3 rounded-xl w-full font-medium text-sm transition-all duration-500"
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
