"use client";
import Image from "next/image";
import { Expertise } from "../../data/expertise";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Github } from "../common/icons";
import { motion } from "framer-motion";

interface ExpertiseCardProps {
  expertise: Expertise;
}

const ExpertiseCard = ({ expertise }: ExpertiseCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex flex-col glass-card rounded-2xl overflow-hidden shadow-[0_0_30px_-15px_rgba(108,99,255,0.1)] hover:shadow-[0_0_40px_-5px_rgba(108,99,255,0.2)] transition-shadow duration-300 border border-border/40 hover:border-primary/40 h-full"
    >
      {/* Expertise Image Panel */}
      <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-border/40 bg-secondary/30 group/img">
        <Image
          src={expertise.image}
          alt={expertise.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover/img:scale-105"
          placeholder="blur"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Technologies/Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {expertise.skills.map((skill) => (
            <span
              key={skill}
              className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary tracking-wide"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Expertise Name */}
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
          {expertise.name}
        </h3>

        {/* Expertise Description */}
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-0 flex-1 line-clamp-3">
          {expertise.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ExpertiseCard;
