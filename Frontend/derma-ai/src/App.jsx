import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./utils/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import GuestPage from "./pages/GuestPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import FindDoctorPage from "./pages/FindDoctorPage";
import DashboardPage from "./pages/DashboardPage";

const AppContent = () => {
  const location = useLocation();

  const hideFooterRoutes = ["/dashboard"];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-[#0c111f] font-sans text-slate-300">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
          },
        }}
      />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:diseaseName" element={<BlogDetailsPage />} />
        <Route path="/dermatologist-near-me" element={<FindDoctorPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
