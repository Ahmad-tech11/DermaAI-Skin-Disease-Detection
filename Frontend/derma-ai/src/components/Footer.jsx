import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900/50 border-t border-slate-800">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white">
            Derma
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              AI
            </span>
          </h3>
          <p className="mt-2 text-slate-400">
            AI-Powered Skin Disease Diagnosis.
          </p>
          {/* Disclaimer for larger screens */}
          <div className="hidden md:block bg-yellow-400/10 border border-yellow-500/30 text-yellow-300 px-6 py-4 rounded-lg mt-6 text-left w-120">
            <h4 className="font-bold text-lg text-yellow-200">
              Medical Disclaimer
            </h4>
            <p className="mt-2 text-sm text-yellow-300/80">
              DermaAI is an informational tool and is not a substitute for
              professional medical diagnosis, advice, or treatment. The analysis
              provided is based on an AI model and may not be fully accurate.
              Always consult with a qualified healthcare provider or
              dermatologist for any medical concerns or before making any health
              decisions.
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/guest"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Try Now
              </Link>
            </li>
            <li>
              <Link
                to="/dermatologist-near-me"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Find a Doctor
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-white">Connect</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="/#contact"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer for smaller screens */}
      <div className="block md:hidden bg-yellow-400/10 border border-yellow-500/30 text-yellow-300 px-6 py-4 rounded-lg mt-8 text-left">
        <h4 className="font-bold text-lg text-yellow-200">
          Medical Disclaimer
        </h4>
        <p className="mt-2 text-sm text-yellow-300/80">
          DermaAI is an informational tool and is not a substitute for
          professional medical diagnosis, advice, or treatment. The analysis
          provided is based on an AI model and may not be fully accurate. Always
          consult with a qualified healthcare provider or dermatologist for any
          medical concerns or before making any health decisions.
        </p>
      </div>

      <div className="mt-12 border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} DermaAI. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
