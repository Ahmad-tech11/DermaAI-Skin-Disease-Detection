import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import ConditionsSection from "../sections/ConditionsSection";
import BlogSection from "../sections/BlogSection";
import ContactSection from "../sections/ContactSection";

const HomePage = () => {
  return (
    <main className="bg-gradient-to-b from-[#0c111f] via-[#111827] to-[#1a202c]">
      <HeroSection />
      <HowItWorksSection />
      <ConditionsSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
};
export default HomePage;
