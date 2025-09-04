import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠", path: "/" },
    { id: "schedule", label: "Class Schedule", icon: "📅", path: "/schedule" },
    { id: "budget", label: "Budget Tracker", icon: "💰", path: "/budget" },
    { id: "exam", label: "Exam Generator", icon: "📝", path: "/exam" },
    { id: "planner", label: "Study Planner", icon: "📚", path: "/planner" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "py-2 bg-gradient-to-r from-[#7D8F69] to-[#A2AF9B] shadow-xl"
          : "py-4 bg-gradient-to-r from-[#8FA37E] to-[#B0BEA9]"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="group flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex justify-center items-center bg-gradient-to-br from-[#E8D7C3] to-[#DCCFC0] shadow-md group-hover:shadow-lg rounded-xl w-12 h-12 group-hover:rotate-12 transition-all duration-500 transform">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-700">
                🎓
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-xl leading-5 tracking-tight">
                Student<span className="text-[#E8D7C3]">Suite</span>
              </span>
              <span className="opacity-80 mt-1 text-[#E8D7C3] text-xs">
                Academic Tools
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-1.5 border border-white/10 rounded-2xl">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 ${
                      isActive
                        ? "bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] text-gray-900 shadow-lg transform -translate-y-0.5"
                        : "text-white hover:bg-white/10 hover:shadow-sm"
                    }`
                  }
                  onMouseEnter={() => setIsHovering(item.id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <span
                    className={`mr-2 transition-transform duration-300 ${
                      isHovering === item.id ? "scale-110" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex justify-center items-center hover:bg-white/10 p-2.5 rounded-xl focus:outline-none text-white transition-all duration-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
                className={({ isActive }) =>
                  `flex items-center w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-[#E8D7C3] to-[#DCCFC0] text-gray-900 shadow-inner transform -translate-y-0.5"
                      : "text-white hover:bg-white/10"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="bg-white/10 mr-4 p-2 rounded-lg text-xl">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
