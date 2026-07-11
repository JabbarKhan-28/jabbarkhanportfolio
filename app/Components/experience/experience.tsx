"use client";
import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2, GraduationCap } from "lucide-react";

const Experience = () => {
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

  const experiences = [
    {
      type: "work",
      role: "App Developer Intern",
      company: "Zaryans Consulting Pvt Ltd",
      duration: "June 2026 – Present",
      icon: <Briefcase size={14} />,
      points: [
        "Developing and maintaining production-grade cross-platform mobile apps with React Native, Expo, and TypeScript.",
        "Delivering secure local AsyncStorage databases, persistent authentication flows, and real-time Firebase-backed APIs.",
        "Collaborating in agile sprints alongside senior engineering leads to debug, optimize, and ship release builds for Android and iOS."
      ]
    },
    {
      type: "education",
      role: "Bachelor of Computer Science",
      company: "Sir Syed C@SE Institute of Technology",
      duration: "2024 – 2028",
      icon: <GraduationCap size={14} />,
      points: [
        "Rigorous coursework in Data Structures, Database Systems, Software Engineering, and Object-Oriented Analysis.",
        "Built several desktop, web, and mobile utility projects as coursework, focusing on algorithm optimization and clean code principles.",
        "Developed a deep technical foundation in data modeling, state handling, and secure software design."
      ]
    }
  ];

  return (
    <section id="experience" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-xs"
          >
            CAREER PATH
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground"
          >
            Work & <span className="text-gradient-blue font-black">Education</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground font-sans leading-relaxed"
          >
            A vertical timeline highlighting my educational path and professional software engineering experience.
          </motion.p>
        </div>

        {/* Vertical Timeline Tree */}
        <div className="max-w-3xl mx-auto relative pl-8 border-l border-border/80">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Custom node marker with pulsing dot */}
                <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-xs text-primary">
                  {exp.icon}
                </div>

                {/* Timeline Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs hover:border-primary/20 transition-all duration-300 relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-foreground tracking-tight leading-tight">
                        {exp.role}
                      </h3>
                      <p className="text-xs font-semibold text-primary mt-1 font-sans">
                        {exp.company}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider w-fit h-fit shrink-0 font-sans">
                      <Calendar size={10} />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 font-sans">
                    {exp.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
