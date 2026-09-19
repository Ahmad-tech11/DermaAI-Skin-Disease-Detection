import { motion } from "framer-motion";
import { UploadCloud, Cpu, FileText } from "lucide-react";

const StepCard = ({ icon, title, description, delay }) => (
  <motion.div
    className="text-center z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-sky-400 hover:bg-white/10"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-teal-400/10 border border-white/10">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 text-slate-400">{description}</p>
  </motion.div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <UploadCloud className="w-12 h-12 text-sky-400" />,
      title: "1. Upload Image",
      description:
        "Select a clear, well-lit photo of the affected skin area from your gallery.",
    },
    {
      icon: <Cpu className="w-12 h-12 text-teal-400" />,
      title: "2. AI Analysis",
      description:
        "Our model analyzes the image using advanced deep learning algorithms.",
    },
    {
      icon: <FileText className="w-12 h-12 text-indigo-400" />,
      title: "3. Get Results",
      description:
        "Receive a potential identification and information about the condition instantly.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            How It Works in 3 Simple Steps
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Get your AI-powered skin analysis quickly and easily.
          </p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} delay={index * 0.2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;
