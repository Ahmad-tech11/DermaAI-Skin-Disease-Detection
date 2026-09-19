import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";
import { apiCall } from "../services/api";
import toast from "react-hot-toast";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const res = await apiCall("post", "/api/auth/register", {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      });

      toast.success(res?.message || "Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration process failed:", error);
    }
  };

  const inputClasses =
    "w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white placeholder-slate-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c111f] via-[#111827] to-[#1a202c] p-4">
      <motion.div
        className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
          <p className="mt-2 text-slate-400">
            Join DermaAI to start your skin health journey.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <UserPlus
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                {...register("fullName", { required: "Full Name is required" })}
                id="fullName"
                placeholder="Full Name"
                className={inputClasses}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

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
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
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

          <div>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={inputClasses}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="w-full font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-3"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
