import { motion } from "framer-motion";

const ContactSection = () => {
  const inputClasses =
    "w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white placeholder-slate-500";

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Get In Touch
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Have questions, feedback, or partnership inquiries? We'd love to
            hear from you.
          </p>
        </div>
        <motion.div
          className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <form action="https://formsubmit.co/muhammadahmadch101@gmail.com" method="POST">
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-slate-300"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                required
                className={inputClasses}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-slate-300"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                required
                className={inputClasses}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block mb-2 font-medium text-slate-300"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="5"
                placeholder="Your message..."
                required
                className={inputClasses}
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="font-bold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-3 w-full md:w-auto"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
export default ContactSection;
