"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { Github, Linkedin } from "../common/icons";
import ProfileCard from "./profileCard";

const Hero = ({ heroData, aboutData }: { heroData?: any; aboutData?: any }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Dynamic Data & Fallbacks
  const headline = heroData?.headline || "Designing & \nbuilding high-impact \nmobile & web apps.";
  const subheading = heroData?.subheading || "React Native mobile developer and Next.js web developer helping startups and modern brands create premium digital interfaces through technical precision, optimized codebases, and smooth micro-interactions.";
  const availabilityBadge = heroData?.availabilityBadge !== undefined ? heroData.availabilityBadge : true;
  const currentRole = heroData?.currentPosition || "APP INTERN";
  const currentCompany = heroData?.currentCompany || "ZARYANS";
  const buttonText = heroData?.buttonText || "View Featured Work";
  const buttonLink = heroData?.buttonLink || "#projects";

  // Parse Stats from AboutSection
  let stats = [
    { value: "1+ YR", label: "Experience" },
    { value: "5+", label: "Built Apps" },
    { value: "100%", label: "Commitment" }
  ];
  if (aboutData?.stats) {
    try {
      stats = JSON.parse(aboutData.stats);
    } catch (e) {}
  }

  return (
    <section id="home" className="relative w-full bg-transparent overflow-hidden pt-32 pb-16 px-4 md:px-8 border-b border-border/80 grid-backdrop">
      {/* Mouse Follow Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-20 hidden md:block"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.08), transparent 80%)`
        }}
      />

      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
      <div className="pointer-events-none absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-6xl mx-auto w-full z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Text Block */}
          <div className="flex flex-col items-start text-left w-full">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {availabilityBadge && (
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full shadow-xs"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  AVAILABLE FOR HIRE
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 border border-secondary/20 bg-secondary/5 text-secondary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full shadow-xs"
              >
                <Briefcase size={10} />
                <span>{currentRole} @ {currentCompany}</span>
              </motion.div>
            </div>

            {/* Display Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading leading-[1.08] tracking-tight text-foreground whitespace-pre-line"
            >
              {headline.includes("\n") ? (
                headline.split("\n").map((part: string, index: number) => {
                  const isLast = index === headline.split("\n").length - 1;
                  return (
                    <span key={index}>
                      {isLast ? (
                        <span className="text-gradient-blue font-black">{part}</span>
                      ) : (
                        <>
                          {part}
                          <br />
                        </>
                      )}
                    </span>
                  );
                })
              ) : (
                headline
              )}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[560px]"
            >
              {subheading}
            </motion.p>

            {/* Inline Stats Counter */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 mt-8 py-4 border-y border-border/80 w-full max-w-[500px]"
            >
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 sm:gap-6">
                  {idx > 0 && <div className="hidden sm:block w-px h-8 bg-border" />}
                  <div>
                    <p className="text-2xl font-black font-heading text-primary leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a href={buttonLink}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-linear-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-500 transition-colors text-primary-foreground text-xs font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-primary/10 flex items-center gap-2 cursor-pointer"
                >
                  <span>{buttonText}</span>
                  <ArrowRight size={14} />
                </motion.button>
              </a>
              <a href={aboutData?.resumeUrl || "/JabbarKhanResume.pdf"} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-border bg-card hover:bg-muted/40 transition-colors text-foreground text-xs font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>Download Resume</span>
                </motion.button>
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-2.5 pl-2">
                <a
                  href="https://github.com/JabbarKhan-28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://linkedin.com/in/jabbar-khan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: profile card */}
          <div className="w-full flex justify-center lg:justify-end">
            <ProfileCard aboutData={aboutData} heroData={heroData} />
          </div>
        </motion.div>

        {/* Current Role / Trust Section (Immediately establishes credibility below Hero content) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="shrink-0">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Current Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-wrap items-center gap-4 w-full md:justify-end">
            {/* Zaryans Consulting */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="glass-card flex items-center gap-3 p-3 px-4 rounded-xl border border-border/80 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                <Briefcase size={14} />
              </div>
              <div>
                <p className="text-[11px] font-black text-foreground leading-none">Zaryans Consulting</p>
                <p className="text-[9px] text-muted-foreground font-semibold mt-1">App Developer Intern</p>
              </div>
            </motion.div>

            {/* FAST NUCES */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="glass-card flex items-center gap-3 p-3 px-4 rounded-xl border border-border/80 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
                <GraduationCap size={14} />
              </div>
              <div>
                <p className="text-[11px] font-black text-foreground leading-none">FAST NUCES University</p>
                <p className="text-[9px] text-muted-foreground font-semibold mt-1">BS Computer Science</p>
              </div>
            </motion.div>

            {/* Verified Stack */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="glass-card flex items-center gap-3 p-3 px-4 rounded-xl border border-border/80 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <p className="text-[11px] font-black text-foreground leading-none">Next.js & React Native</p>
                <p className="text-[9px] text-muted-foreground font-semibold mt-1">Verified Stack Expertise</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;