import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  HeartPulse,
  Shield,
  Footprints,
  Bug,
  Wind,
  Scan,
  Sparkles,
} from "lucide-react";

const ConditionCard = ({ icon, name, delay }) => (
  <motion.div
    className="w-36"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
  >
    <Link
      to={`/blogs/${encodeURIComponent(name)}`}
      className="group aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-sky-400 hover:bg-white/10"
    >
      <div className="text-5xl text-sky-400 mb-3 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="font-semibold text-white text-center text-base">{name}</h3>
    </Link>
  </motion.div>
);

const ConditionsSection = () => {
  const conditions = [
    { icon: <Sparkles />, name: "Nail Fungus" },
    { icon: <Scan />, name: "Ringworm" },
    { icon: <Wind />, name: "Shingles" },
    { icon: <Bug />, name: "Impetigo" },
    { icon: <Footprints />, name: "Athlete's Foot" },
    { icon: <HeartPulse />, name: "Chickenpox" },
    { icon: <Stethoscope />, name: "Cutaneous Larva Migrans" },
    { icon: <Shield />, name: "Cellulitis" },
  ];
  return (
    <section id="try-now" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Conditions We Analyze
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Our AI model is trained to recognize visual patterns of the
            following common skin conditions.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {conditions.map((item, index) => (
            <ConditionCard key={index} {...item} delay={index * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default ConditionsSection;
