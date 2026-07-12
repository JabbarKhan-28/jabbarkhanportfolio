"use client";
import { motion } from "framer-motion";
import { Trophy, Award, Smartphone, Sparkles, BadgeCheck } from "lucide-react";
import { Github } from "../common/icons";

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: React.ReactNode;
}

const achievementsData: Achievement[] = [
  {
    title: "App Developer Intern Certification",
    issuer: "Zaryans Consulting Pvt Ltd",
    date: "2026",
    description: "Successfully recognized for contributing key engineering work in React Native mobile builds and integrating firebase backend sync.",
    icon: <Award className="text-primary" size={18} />,
  },
  {
    title: "React Native Devloper",
    issuer: "Frontend Master's",
    date: "2026",
    description: "Mastering the React Native ecosystem, covering component architecture, state management, and building production-ready mobile applications with clean code and modern UI patterns.",
    icon: <Trophy className="text-secondary" size={18} />,
  },
  {
    title: "Next.js Devleoper",
    issuer: "Frontend Masters",
    date: "2026",
    description: "Mastering the Next.js ecosystem, covering component architecture, state management, and building production-ready applications with clean code and modern UI patterns.",
    icon: <Smartphone className="text-emerald-500" size={18} />,
  },
  {
    title: "GitHub Student Developer Partner",
    issuer: "GitHub Education",
    date: "2024",
    description: "Accepted into the developer pack program, leveraging advanced student developer environments and building portfolio systems.",
    icon: <Github className="text-cyan-500" size={18} />,
  },
];



const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Award":
      return <Award className="text-primary" size={18} />;
    case "Trophy":
      return <Trophy className="text-secondary" size={18} />;
    case "Smartphone":
      return <Smartphone className="text-emerald-500" size={18} />;
    case "Github":
      return <Github className="text-cyan-500" size={18} />;
    default:
      return <BadgeCheck className="text-primary" size={18} />;
  }
};

const Achievements = ({ achievementsData: dbAchievementsData }: { achievementsData?: any[] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const resolvedAchievements = dbAchievementsData && dbAchievementsData.length > 0
    ? dbAchievementsData.filter(cert => cert.published).map(cert => ({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        description: cert.description || "",
        icon: getIcon(cert.icon)
      }))
    : achievementsData;

  return (
    <section id="achievements" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
      {/* Background ambient details */}
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl opacity-30 animate-pulse-slow" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-xs"
          >
            GROWTH & RECOGNITION
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground"
          >
            Achievements & <span className="text-gradient-blue font-black">Certifications</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-xl text-sm text-muted-foreground font-sans leading-relaxed"
          >
            Highlights of academic achievements, active developer certifications, and platform publication achievements.
          </motion.p>
        </div>

        {/* Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {resolvedAchievements.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-2xl border border-border/80 shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-foreground tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 font-sans">
                    <span className="text-[10px] font-semibold text-primary">{item.issuer}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans pt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
