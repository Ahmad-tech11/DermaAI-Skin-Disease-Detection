import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { apiCall } from "../services/api";
import { getCookie } from "../utils/cookies";
import NavLink from "./NavLink";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = getCookie("sessionId");
    if (sessionId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiCall("post", "/api/auth/logout");
      document.cookie =
        "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "csrf_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setIsLoggedIn(false);
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/blogs", text: "Blogs" },
    { to: "/guest", text: "Try Now" },
    { to: "/dermatologist-near-me", text: "Find a Doctor" },
  ];

  const GradientButton = ({ to, children }) => (
    <RouterLink
      to={to}
      className="inline-block font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-2"
    >
      {children}
    </RouterLink>
  );

  return (
    <header className="bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <RouterLink to="/" className="text-2xl font-bold text-white">
          Derma
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            AI
          </span>
        </RouterLink>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.text}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <RouterLink
                to="/dashboard"
                className="font-medium text-slate-300 hover:text-white transition-colors duration-200 px-4 py-2"
              >
                Dashboard
              </RouterLink>
              <button
                onClick={handleLogout}
                className="font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <RouterLink
                to="/login"
                className="font-medium text-slate-300 hover:text-white transition-colors duration-200 px-4 py-2"
              >
                Login
              </RouterLink>
              <GradientButton to="/signup">Sign Up</GradientButton>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-4 space-y-2"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="block text-center py-2"
            >
              {link.text}
            </NavLink>
          ))}
          <div className="border-t border-slate-700 my-2"></div>
          {isLoggedIn ? (
            <>
              <RouterLink
                to="/dashboard"
                className="block font-medium text-slate-300 text-center py-2"
              >
                Dashboard
              </RouterLink>
              <button
                onClick={handleLogout}
                className="block w-full text-center mt-2 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <RouterLink
                to="/login"
                className="block font-medium text-slate-300 text-center py-2"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/signup"
                className="block w-full text-center mt-2 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-3"
              >
                Sign Up
              </RouterLink>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
};
export default Header;
