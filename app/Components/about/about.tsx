"use client";
import { motion } from "framer-motion";
import { User, Target, Compass, Coffee } from "lucide-react";
import Image from "next/image";
import Img from "../../../assets/JabbarKhanProfilePicture.jpg";

const About = () => {
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
    <section id="about" className="relative w-full bg-transparent overflow-hidden py-24 border-b border-border/80">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
      <div className="pointer-events-none absolute top-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-6xl mx-auto w-full px-4 md:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column: Framed Image */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              variants={itemVariants}
              className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl p-3 bg-card border border-border shadow-xs hover:border-primary/20 transition-colors duration-500"
            >
              {/* Layered border glow */}
              <div className="absolute -inset-px bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 rounded-2xl pointer-events-none" />

              <div className="w-full h-full rounded-xl overflow-hidden bg-muted/20 border border-border/40 relative group">
                <Image
                  src={Img}
                  alt="Jabbar Khan working"
                  className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-102"
                  placeholder="blur"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Text Story & Fun Facts */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-6 shadow-xs"
            >
              <User size={10} />
              <span>MY BIOGRAPHY</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold font-heading leading-tight tracking-tight text-foreground"
            >
              Crafting performance-driven <br />
              <span className="text-gradient-blue font-black">mobile & web apps</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans"
            >
              Hello! I&apos;m Jabbar Khan, a Software Engineer with production experience building cross-platform mobile and web applications using React Native, Next.js, TypeScript, and Expo. I specialize in architecting clean, maintainable component systems, integrating offline-first storage and Firebase API layers, implementing persistent auth flows, and shipping optimized release builds for Android, iOS, and web.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans"
            >
              My professional focus lies in performance optimization, clean state transitions, and responsive user experiences — from buttery smooth gestures to SEO-optimized, highly structured web platforms. I am currently an App Developer Intern at Zaryans Consulting, working closely with senior engineering leads to maintain and ship scale-ready codebases.
            </motion.p>

            {/* Quick stats / fun facts grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/80 w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                  <Target size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">My Goal</h4>
                  <p className="text-xs font-bold text-foreground">Clean, Scale Code</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10 shrink-0">
                  <Compass size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Philosophy</h4>
                  <p className="text-xs font-bold text-foreground">UX First Principles</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10 shrink-0">
                  <Coffee size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Interest</h4>
                  <p className="text-xs font-bold text-foreground">Tech Curation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
