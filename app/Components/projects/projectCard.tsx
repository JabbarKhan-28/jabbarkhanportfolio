"use client";
import Image from "next/image";
import { Project } from "../../data/projects";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, CheckCircle, Lightbulb, Zap, ShieldCheck } from "lucide-react";
import { Github } from "../common/icons";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full glass-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8"
    >
      {/* Left Column: Image, Title, Stack & Actions */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          {/* Project Image Box */}
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/20 group/img">
            <Image
              src={project.image}
              alt={`${project.name} preview`}
              className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover/img:scale-102"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Project Title */}
          <div>
            <h3 className="text-xl font-bold font-heading text-foreground tracking-tight leading-tight">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/5 border border-primary/15 text-primary tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              size="default"
              className="w-full justify-center gap-2 rounded-xl border-border bg-card hover:bg-muted/40 text-foreground cursor-pointer text-xs font-semibold h-11"
            >
              <Github size={14} />
              <span>GitHub Code</span>
            </Button>
          </a>

          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="default"
              className="w-full justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer text-xs font-semibold h-11 text-primary-foreground"
            >
              <span>Live Demo</span>
              <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      </div>

      {/* Right Column: In-depth Case Study Grid */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-5 font-sans border-t lg:border-t-0 lg:border-l border-border/80 pt-6 lg:pt-0 lg:pl-8">
        <div className="space-y-4">
          {/* Problem */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Lightbulb size={11} className="text-amber-500" />
              <span>The Problem</span>
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
              {project.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <CheckCircle size={11} className="text-emerald-500" />
              <span>The Solution</span>
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
              {project.solution}
            </p>
          </div>

          {/* Architecture */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Code size={11} className="text-primary" />
              <span>Data Architecture</span>
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
              {project.architecture}
            </p>
          </div>

          {/* Challenges & Optimizations */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Zap size={11} className="text-secondary" />
              <span>Key Challenges & Optimizations</span>
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
              {project.challenges}
            </p>
          </div>

          {/* Result */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <ShieldCheck size={11} className="text-cyan-500" />
              <span>Outcome & Metrics</span>
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
              {project.result}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
