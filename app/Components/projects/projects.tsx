"use client";
import { motion } from "framer-motion";
import { projectsData } from "../../data/projects";
import ProjectCard from "./projectCard";

const Projects = () => {
  // Extract top 3 best projects for high-impact showcase
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section id="projects" className="relative w-full bg-transparent overflow-hidden py-20 border-b border-border/80">
      {/* Ambient background light details */}
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-xs"
          >
            SELECTED SHOWCASE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground"
          >
            Featured <span className="text-gradient-blue font-black">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground font-sans leading-relaxed"
          >
            A curated selection of mobile and web applications I have designed and engineered, detailing challenges, technical choices, and optimized results.
          </motion.p>
        </div>

        {/* Stacked Case Studies List */}
        <div className="space-y-12">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
