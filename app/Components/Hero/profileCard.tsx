"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Img from "../../../assets/JabbarKhanProfilePicture.jpg";

const ProfileCard = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(
        "relative glass-card shadow-md hover:shadow-lg rounded-2xl p-5 w-full max-w-[350px] transition-all duration-300 hover:border-primary/30",
        className
      )}
    >
      {/* Dynamic card glow border highlight */}
      <div className="absolute -inset-px bg-linear-to-tr from-primary/5 via-transparent to-primary/5 rounded-2xl pointer-events-none" />

      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border/40 bg-muted/20 group/img">
        <Image
          src={Img}
          alt="Jabbar Khan profile"
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover/img:scale-103"
          priority
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="mt-4 text-base font-bold font-heading text-center text-foreground tracking-tight">
        Jabbar Khan
      </h3>

      <div className="mt-4 pt-4 border-t border-border space-y-2.5 relative z-10 font-sans">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-semibold">Core Stacks</span>
          <span className="font-bold text-foreground text-right">React Native & Next.js</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-semibold">Main Language</span>
          <span className="font-bold text-foreground">TypeScript (ES6+)</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-semibold">Workflow</span>
          <span className="font-bold text-primary text-right">Expo, Redux, Zustand</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;