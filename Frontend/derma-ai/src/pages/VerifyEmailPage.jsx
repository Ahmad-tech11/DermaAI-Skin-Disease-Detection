import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MailCheck,
  Send,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { apiCall } from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      const verifyToken = async () => {
        try {
          await apiCall(
            "get",
            `/api/auth/verify-email?email=${email}&token=${token}`
          );
          setVerificationStatus("success");
          setTimeout(() => {
            navigate("/login");
          }, 5000); // Redirect to login after 5 seconds
        } catch (error) {
          setVerificationStatus("error");
          console.error("Email verification failed:", error);
        }
      };
      verifyToken();
    } else {
      setVerificationStatus("idle");
    }
  }, [searchParams, navigate]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      await apiCall("post", "/api/auth/request-verification-token", {
        email: resendEmail,
      });
      toast.success(
        `A new verification email has been sent to ${resendEmail}.`
      );
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };

  const inputClasses =
    "w-full pl-4 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white placeholder-slate-500";

  const renderStatus = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <>
            <Loader className="text-sky-400 animate-spin" size={64} />
            <h2 className="text-3xl font-bold text-white mt-6">
              Verifying Your Email...
            </h2>
            <p className="mt-4 text-slate-400">Please wait a moment.</p>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="text-teal-400" size={64} />
            <h2 className="text-3xl font-bold text-white mt-6">
              Verification Successful!
            </h2>
            <p className="mt-4 text-slate-400">
              Your email has been verified. You will be redirected to the login
              page shortly.
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="font-medium text-sky-400 hover:text-sky-300 transition-colors"
              >
                Click here to log in now.
              </Link>
            </div>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="text-red-400" size={64} />
            <h2 className="text-3xl font-bold text-white mt-6">
              Verification Failed
            </h2>
            <p className="mt-4 text-slate-400">
              The verification link is invalid or has expired. Please request a
              new one.
            </p>
            {renderResendForm()}
          </>
        );
      default:
        return (
          <>
            <MailCheck className="text-teal-400" size={64} />
            <h2 className="text-3xl font-bold text-white mt-6">
              Verify Your Email
            </h2>
            <p className="mt-4 text-slate-400">
              Please check your email for a verification link, or request a new
              one below.
            </p>
            {renderResendForm()}
          </>
        );
    }
  };

  const renderResendForm = () => (
    <div className="mt-8 w-full">
      <p className="text-slate-400 mb-4">
        Didn't receive the email or link expired?
      </p>
      <form
        onSubmit={handleResendVerification}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          placeholder="Enter your email to resend"
          required
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full sm:w-auto flex-shrink-0 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Resend
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c111f] via-[#111827] to-[#1a202c] p-4">
      <motion.div
        className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {renderStatus()}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
