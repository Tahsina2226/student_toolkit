import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { AuthContext } from "../../componetns/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        token: res.data.token,
      };

      login(userData);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#DCCFC0] to-[#FAF9EE] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 bg-white shadow-lg p-10 rounded-xl w-full max-w-md">
        <div className="text-center">
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-700 text-sm">
            Sign in to access your account
          </p>
        </div>
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div className="-space-y-px shadow-sm rounded-md">
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block focus:z-10 relative px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block focus:z-10 relative px-3 py-3 border border-[#A2AF9B] focus:border-[#7D8F69] rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 w-full text-gray-900 sm:text-sm placeholder-gray-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center bg-[#7D8F69] hover:bg-[#A2AF9B] disabled:opacity-75 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-[#7D8F69] focus:ring-2 focus:ring-offset-2 w-full font-medium text-white text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#7D8F69] font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
