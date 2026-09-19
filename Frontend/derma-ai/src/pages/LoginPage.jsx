import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { apiCall } from "../services/api";
import toast from "react-hot-toast";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const params = new URLSearchParams();
    params.append("username", data.email);
    params.append("password", data.password);

    try {
      const response = await apiCall("post", "/api/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.access_token) {
        document.cookie = `sessionId=${response.access_token}; path=/; max-age=3600; SameSite=Lax`;
        toast.success("Login successful!");
        window.location.href = "/dashboard";
      } else {
        toast.error("Login failed: No token received.");
      }
    } catch (error) {
      console.error("Login process failed:", error);
    }
  };

  const inputClasses =
    "w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white placeholder-slate-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c111f] via-[#111827] to-[#1a202c] p-.5">
      <motion.div
        className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-slate-400">
            Log in to continue your journey with DermaAI.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={inputClasses}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                id="password"
                type="password"
                placeholder="Password"
                className={inputClasses}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="w-full font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-3"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
