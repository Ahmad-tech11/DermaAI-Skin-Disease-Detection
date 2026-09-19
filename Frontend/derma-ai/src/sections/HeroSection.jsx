import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCookie } from "../utils/cookies";

const HeroSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionId = getCookie("sessionId");
    if (sessionId) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section id="home" className="relative py-24 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
                    radial-gradient(at 20% 80%, hsla(210, 80%, 30%, 0.2) 0px, transparent 50%),
                    radial-gradient(at 80% 20%, hsla(160, 70%, 40%, 0.2) 0px, transparent 50%),
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M11 11L89 89M89 11L11 89' stroke='%231e293b' stroke-width='1'/%3E%3C/svg%3E")
                 `,
          backgroundSize: "cover, cover, 100px 100px",
        }}
      ></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
        >
          Intelligent Skin Diagnosis
          <span className="block mt-2 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Powered by AI
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-slate-300"
        >
          DermaAI uses advanced Artificial Intelligence to help you identify
          common skin conditions from an image. Get instant, data-driven
          insights to better understand your skin health.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-block font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;
