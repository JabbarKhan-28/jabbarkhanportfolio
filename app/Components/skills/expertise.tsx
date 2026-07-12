"use client";
import { motion } from "framer-motion";
import { Code2, Smartphone, Database, Wrench, CheckCircle } from "lucide-react";

export const TechCategoriesDefault = [
  {
    title: "Frontend Engineering",
    description: "Building responsive, fast, and SEO-optimized web applications with modern rendering patterns.",
    icon: <Code2 size={18} className="text-primary" />,
    skills: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "HTML5 & CSS3"],
  },
  {
    title: "Mobile Development",
    description: "Developing cross-platform native iOS & Android apps with a focus on fluid animations.",
    icon: <Smartphone size={18} className="text-secondary" />,
    skills: ["React Native", "Expo", "TypeScript", "Reanimated 2", "Gesture Handler"],
  },
  {
    title: "Backend & Databases",
    description: "Implementing client-side caching, offline local storage, and real-time backend structures.",
    icon: <Database size={18} className="text-emerald-500" />,
    skills: ["Firebase Auth", "Cloud Firestore", "AsyncStorage", "localStorage", "REST APIs"],
  },
  {
    title: "Tools & Practices",
    description: "Writing maintainable codebase architectures, debugging, and testing performance targets.",
    icon: <Wrench size={18} className="text-cyan-500" />,
    skills: ["Git & GitHub", "Clean Code", "VS Code", "Performance Audit", "API Integration"],
  },
];

const Expertise = ({ skillsData, servicesData }: { skillsData?: any[]; servicesData?: any[] }) => {
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

  // Group database skills by category dynamically
  let resolvedCategories = TechCategoriesDefault;
  if (skillsData && skillsData.length > 0) {
    const uniqueCategories = Array.from(new Set(skillsData.map((s) => s.category)));
    resolvedCategories = uniqueCategories.map((catName) => {
      const defaultCat = TechCategoriesDefault.find((c) => c.title === catName);
      const categorySkills = skillsData
        .filter((s) => s.category === catName)
        .map((s) => s.name);

      return {
        title: catName,
        description: defaultCat?.description || `Professional expertise in ${catName} technologies and tools.`,
        icon: defaultCat?.icon || <Code2 size={18} className="text-primary" />,
        skills: categorySkills,
      };
    });
  }

  return (
    <div className="w-full">
      {/* 1. Tech Stack Category Panels */}
      <section id="tech-stack" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
        {/* Background ambient details */}
        <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-30" />

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
              ENGINEERING CORES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground"
            >
              Technical <span className="text-gradient-blue font-black">Tech Stack</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 max-w-xl text-sm text-muted-foreground font-sans leading-relaxed"
            >
              A split architectural categorization of the core libraries, environments, and languages I use to build user experiences.
            </motion.p>
          </div>

          {/* Grid Panel Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {resolvedCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-foreground tracking-tight leading-tight">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/80">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted/40 border border-border text-foreground/80 tracking-wide font-sans"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Skills Pills Section */}
      <section id="skills" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
        <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
          <div className="mb-16 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-xs"
            >
              COMPETENCIES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground"
            >
              Skills & <span className="text-gradient-blue font-black">Expertise</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 max-w-xl text-sm text-muted-foreground font-sans leading-relaxed"
            >
              Pills and tags mapping my experience levels across different technologies. No visual padding or arbitrary percentage bars.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {resolvedCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col gap-3"
              >
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pl-1">
                  {cat.title}
                </h3>
                <div className="flex flex-col gap-2">
                  {cat.skills.map((skill) => (
                    <motion.div
                      key={skill}
                      whileHover={{ x: 2 }}
                      className="glass-card flex items-center gap-2.5 p-3 rounded-xl border border-border/80 shadow-xs hover:border-primary/25 transition-colors duration-200"
                    >
                      <CheckCircle size={12} className="text-primary shrink-0" />
                      <span className="text-xs font-bold text-foreground font-sans leading-none">
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Expertise;
