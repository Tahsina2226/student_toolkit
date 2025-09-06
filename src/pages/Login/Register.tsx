import { useState, useContext, FormEvent } from "react";
import { AuthContext } from "../../componetns/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      login(res.data);

      await MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Your account has been created.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err: any) {
      MySwal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#DCCFC0] to-[#FAF9EE] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 bg-white shadow-lg p-10 rounded-xl w-full max-w-md">
        <div className="text-center">
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl">
            Create Account
          </h2>
          <p className="mt-2 text-gray-700 text-sm">
            Sign up to start using StudentSuite
          </p>
        </div>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div className="-space-y-px shadow-sm rounded-md">
            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="block px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
              />
            </div>

            <div className="relative mb-5">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="top-9 right-3 absolute text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="relative mb-5">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="block px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="top-9 right-3 absolute text-gray-500"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center bg-[#7D8F69] hover:bg-[#A2AF9B] disabled:opacity-75 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 focus:ring-offset-2 w-full font-medium text-white text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="text-center">
            <p className="mt-4 text-gray-700 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-[#7D8F69] hover:text-[#A2AF9B] transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
