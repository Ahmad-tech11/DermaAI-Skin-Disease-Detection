import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Shield, Activity, Heart, Zap, HelpCircle } from "lucide-react";
import { diseaseData } from "../data/diseaseData";

const DetailSection = ({ title, content, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: delay }}
  >
    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
      {icon}
      {title}
    </h3>
    {Array.isArray(content) ? (
      <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-slate-300">{content}</p>
    )}
  </motion.div>
);

const BlogDetailsPage = () => {
  const { diseaseName } = useParams();
  const disease = diseaseData.find(
    (d) => d.name === decodeURIComponent(diseaseName)
  );

  if (!disease) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white p-4">
        <h1 className="text-4xl font-bold">Disease Not Found</h1>
        <p className="mt-4 text-slate-400">
          Sorry, we couldn't find any information for "
          {decodeURIComponent(diseaseName)}".
        </p>
        <Link
          to="/blogs"
          className="mt-8 inline-flex items-center gap-2 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4"
        >
          <Home size={20} />
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white py-12 md:py-24">
      <main className="container mx-auto px-6">
        <motion.div
          className="w-full lg:w-2/3 mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 text-center">
            {disease.name}
          </h1>

          {/* Hero Banner Image */}
          <motion.div
            className="relative w-full rounded-2xl overflow-hidden mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              src={disease.imgSrc}
              alt={`${disease.name} skin condition`}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c111f] via-transparent to-transparent" />
          </motion.div>

          <div className="space-y-12">
            <DetailSection
              title={`What is ${disease.name}?`}
              content={disease.details.whatItIs}
              icon={<HelpCircle className="text-purple-400" />}
              delay={0.1}
            />
            <DetailSection
              title="Symptoms"
              content={disease.details.symptoms}
              icon={<Activity className="text-red-400" />}
              delay={0.2}
            />
            <DetailSection
              title="Causes"
              content={disease.details.causes}
              icon={<Zap className="text-yellow-400" />}
              delay={0.25}
            />
            <DetailSection
              title="Prevention"
              content={disease.details.prevention}
              icon={<Shield className="text-blue-400" />}
              delay={0.3}
            />
            <DetailSection
              title="Treatment"
              content={disease.details.treatment}
              icon={<Heart className="text-green-400" />}
              delay={0.35}
            />
          </div>

          <div className="text-center mt-16">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4"
            >
              <Home size={20} />
              Back to Library
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogDetailsPage;
