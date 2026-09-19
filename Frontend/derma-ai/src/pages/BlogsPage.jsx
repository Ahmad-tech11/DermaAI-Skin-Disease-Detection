import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { diseaseData } from "../data/diseaseData";

const DiseaseCard = ({ name, description, imgSrc, delay }) => (
  <motion.div
    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-sky-400 hover:bg-white/10 flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="overflow-hidden">
      <img
        src={imgSrc}
        alt={`${name} skin condition`}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="mt-2 text-slate-400 flex-grow">{description}</p>
      <Link
        to={`/blogs/${encodeURIComponent(name)}`}
        className="mt-4 inline-flex items-center font-semibold text-sky-400 hover:text-sky-300 transition-colors self-start"
      >
        Learn More <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  </motion.div>
);

const BlogsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white">
      <main className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Skin Condition Library
          </h1>
          <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
            Explore our comprehensive guide to various skin conditions. Click on
            any topic to learn more about its causes, symptoms, and general
            information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {diseaseData.map((disease, index) => (
            <DiseaseCard
              key={disease.name}
              name={disease.name}
              description={disease.description}
              imgSrc={disease.imgSrc}
              delay={index * 0.05}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogsPage;
