"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, MessageSquare, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { Github, Linkedin } from "../common/icons";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const inputClasses =
    "w-full rounded-xl bg-card border border-border/80 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus:border-primary/80 transition-all py-3 px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/40 font-sans shadow-xs";

  const labelClasses = "text-[10px] font-bold text-muted-foreground tracking-wider uppercase font-heading";

  return (
    <section id="contact" className="relative w-full bg-transparent overflow-hidden py-24">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
      <div className="pointer-events-none absolute -top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column: Context details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-6 shadow-xs"
              >
                <MessageSquare size={10} />
                <span>INQUIRIES</span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-3xl sm:text-4xl font-bold font-heading leading-tight tracking-tight text-foreground"
              >
                Let&apos;s build something <br />
                <span className="text-gradient-blue font-black">extraordinary</span> together.
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans"
              >
                Have a project, a full-time role, or contracting inquiry in mind? Send a direct message and let&apos;s talk about technical details.
              </motion.p>
            </div>

            <div className="mt-10 space-y-6">
              {/* Location */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:border-primary/30 transition-colors duration-300 shadow-xs">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className={labelClasses}>Location</h4>
                  <p className="text-xs sm:text-sm font-bold text-foreground font-sans">Pakistan (GMT+5) / Remote Worldwide</p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 group">
                <a href="mailto:jabbar118114@gmail.com" className="flex items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 w-fit">
                  <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:border-primary/30 transition-colors duration-300 shadow-xs">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className={labelClasses}>Email</h4>
                    <p className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors font-sans">
                      jabbar118114@gmail.com
                    </p>
                  </div>
                </a>
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 group">
                <a href="tel:+923128983602" className="flex items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 w-fit">
                  <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:border-primary/30 transition-colors duration-300 shadow-xs">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className={labelClasses}>Phone</h4>
                    <p className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors font-sans">
                      +92 312 8983602
                    </p>
                  </div>
                </a>
              </motion.div>

              {/* Social Channels */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 pt-6 border-t border-border/80">
                <a
                  href="https://github.com/JabbarKhan-28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 transition-all duration-300 shadow-xs"
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://linkedin.com/in/jabbar-khan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 transition-all duration-300 shadow-xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-border shadow-xs relative w-full"
          >
            <div className="absolute -inset-px bg-linear-to-tr from-primary/5 via-transparent to-primary/5 rounded-2xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className={labelClasses}>Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jabbar Khan"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelClasses}>Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jabbarkhan@gmail.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className={labelClasses}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry / Job Opportunity"
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className={labelClasses}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or open position..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-500 hover:shadow-md hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 shadow-xs transition-all py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Message Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={12} />
                  </>
                )}
              </button>

              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle size={14} className="text-red-500" />
                    <span>Please fill in name, email, and message before sending.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;