"use client";
import { motion } from "framer-motion";
import { projectsData } from "../../data/projects";
import { FolderGit2, ShieldAlert, Cpu } from "lucide-react";
import { Github } from "../common/icons";
import { Button } from "@/components/ui/button";

const OtherProjects = ({ projectsData: dbProjectsData }: { projectsData?: any[] }) => {
  // Grab remaining projects (published, but not in top 3 featured)
  const otherProjects = dbProjectsData && dbProjectsData.length > 0
    ? dbProjectsData.filter((p: any) => p.published && !p.featured)
    : projectsData.slice(3);

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

  return (
    <section id="other-projects" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
      {/* Background ambient lights */}
      <div className="pointer-events-none absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
      <div className="pointer-events-none absolute top-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-secondary/20 bg-secondary/5 text-secondary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-xs"
          >
            ADDITIONAL EXPERIMENTS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground"
          >
            Other Notable <span className="text-gradient-purple font-black">Repositories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed"
          >
            A compilation of smaller utility libraries, boilerplate generators, and specialized developer tooling.
          </motion.p>
        </div>

        {/* Other Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          {otherProjects.map((project, idx) => {
            const isCyber = project.id.includes("cyber");
            const projectIcon = isCyber ? (
              <ShieldAlert size={18} className="text-secondary" />
            ) : (
              <Cpu size={18} className="text-cyan-500" />
            );

            const resolvedSkills = typeof project.skills === "string"
              ? project.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
              : project.skills || [];

            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      {projectIcon}
                    </div>
                    <FolderGit2 size={16} className="text-muted-foreground/40" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-foreground tracking-tight leading-snug">
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans mt-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {resolvedSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted/50 border border-border text-foreground/70 tracking-wide font-sans"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Github Button */}
                {project.githubLink && (
                  <div className="pt-6 mt-6 border-t border-border/80">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full justify-center gap-2 rounded-xl border-border bg-card hover:bg-muted/40 text-foreground cursor-pointer text-xs font-semibold h-10"
                      >
                        <Github size={12} />
                        <span>Code Repository</span>
                      </Button>
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default OtherProjects;
