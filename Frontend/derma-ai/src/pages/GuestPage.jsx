import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  UploadCloud,
  X,
  Info,
  Loader,
  Trash2,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { apiCall } from "../services/api";
import { getCookie } from "../utils/cookies";

let hasGuestVisitedThisSession = false;

const GuestWarningModal = ({ isOpen, onClose, isLoggedIn }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-8 relative text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center text-center">
            <Info size={48} className="text-sky-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">You are in Guest Mode</h2>
            <p className="text-slate-400 mb-6">
              Your analysis history will not be saved. To keep a record of your
              results, please create an account or log in.
            </p>
            <div className="w-full space-y-3">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-center font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-teal-500 to-green-500 px-8 py-3 flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={20} />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="block w-full text-center font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-3"
                >
                  Create an Account
                </Link>
              )}
              <button
                onClick={onClose}
                className="w-full bg-slate-700 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ResultModal = ({ isOpen, onClose, prediction }) => {
  if (!isOpen || !prediction) return null;

  const confidence = prediction.confidence || 0;
  const isNoDiseaseDetected = prediction.disease === "No Disease Detected";
  const confidenceColor = isNoDiseaseDetected
    ? "bg-amber-500"
    : confidence > 75
    ? "bg-green-500"
    : confidence > 50
    ? "bg-yellow-500"
    : "bg-red-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-lg w-full max-w-lg relative text-white"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Analysis Result
            </h2>

            {isNoDiseaseDetected && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-amber-300 text-sm text-center">
                  ⚠️ The uploaded image is not a valid skin condition image.
                  Please upload a clear skin image.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center text-lg">
                <span className="font-semibold text-slate-400 w-32">
                  Prediction:
                </span>
                <p className={`text-2xl font-bold ${isNoDiseaseDetected ? "text-amber-400" : "text-white"}`}>
                  {prediction.disease}
                </p>
              </div>
              <div className="flex items-center text-lg">
                <span className="font-semibold text-slate-400 w-32">
                  Confidence:
                </span>
                <p className="text-2xl font-bold">
                  {prediction.confidence.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-slate-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-4 rounded-full ${confidenceColor}`}
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:brightness-110 transform hover:-translate-y-px"
              >
                <RefreshCw size={18} />
                {isNoDiseaseDetected ? "Try Another Image" : "Analyze Another Image"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Guest Page Component
const GuestPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const analyzeButtonRef = useRef(null);

  useEffect(() => {
    if (getCookie("sessionId")) {
      setIsLoggedIn(true);
    }
    if (!hasGuestVisitedThisSession) {
      setIsWarningOpen(true);
      hasGuestVisitedThisSession = true;
    }
  }, []);

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setIsResultModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    resetState();
    if (fileRejections.length > 0) {
      toast.error("Invalid file type. Please upload an image (jpeg, png).");
      return;
    }
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setTimeout(() => {
      const buttonElement = analyzeButtonRef.current;
      if (buttonElement) {
        const offset = 11;
        const targetScrollY = offset;

        window.scrollTo({
          top: targetScrollY,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    resetState();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiCall(
        "post",
        "/api/guest/guest-predict",
        formData
      );
      setPrediction(response);
      setIsResultModalOpen(true);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white flex flex-col">
      <GuestWarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        isLoggedIn={isLoggedIn}
      />
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={resetState}
        prediction={prediction}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Guest Analysis
            </h1>
            <p className="text-lg text-slate-400 mt-2">
              Upload a skin image to get an instant AI-powered analysis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 w-full"
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${
                isDragActive
                  ? "border-sky-400 bg-sky-900/20"
                  : "border-slate-700 bg-slate-900/20 hover:border-sky-500"
              }`}
            >
              <input {...getInputProps()} />
              <AnimatePresence>
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4"
                  >
                    <img
                      src={preview}
                      alt="Skin lesion preview"
                      className="rounded-lg w-full h-auto max-h-80 object-contain"
                    />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center items-center text-center p-10 h-60"
                  >
                    <UploadCloud className="h-16 w-16 text-slate-500 mb-4" />
                    <p className="text-slate-400">
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop image here, or click to select"}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      Supports: PNG, JPG
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              ref={analyzeButtonRef}
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full font-bold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:brightness-110 transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Analyze Image
                </>
              )}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default GuestPage;
