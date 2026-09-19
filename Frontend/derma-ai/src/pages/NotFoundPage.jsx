import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c111f] via-[#111827] to-[#1a202c] p-4 text-center">
      <motion.div
        className="w-full max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle className="text-yellow-400" size={80} />
        </div>
        <h1 className="text-8xl font-extrabold text-white tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="mt-4 text-slate-400 max-w-sm mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4"
          >
            <Home size={20} />
            Go Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
