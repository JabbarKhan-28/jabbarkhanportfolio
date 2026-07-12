"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../../assets/logo/logo.png";
import { Github, Linkedin } from "../common/icons";
import { ArrowUp } from "lucide-react";

const Footer = ({ contactData }: { contactData?: any }) => {
  const currentYear = new Date().getFullYear();

  const links = [
    { title: "Home", href: "#home" },
    { title: "Projects", href: "#projects" },
    { title: "About", href: "#about" },
    { title: "Experience", href: "#experience" },
    { title: "Tech Stack", href: "#tech-stack" },
    { title: "Skills", href: "#skills" },
    { title: "Achievements", href: "#achievements" },
    { title: "Contact", href: "#contact" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const githubLink = contactData?.github || "https://github.com/JabbarKhan-28";
  const linkedinLink = contactData?.linkedin || "https://linkedin.com/in/jabbar-khan";

  return (
    <footer className="relative border-t border-border/80 bg-card/40 backdrop-blur-md overflow-hidden font-sans">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />

      <div className="max-w-6xl mx-auto w-full px-4 py-12 sm:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Logo & Details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <a href="#home" className="flex items-center gap-2.5 group">
            <Image 
              src={Logo} 
              alt="Jabbar logo" 
              width={30} 
              height={30} 
              className="rounded-full border border-primary/20 transition-transform group-hover:rotate-12 duration-500" 
            />
            <span className="text-lg font-bold font-heading text-gradient-blue tracking-tight">Jabbar Khan</span>
          </a>
          <p className="max-w-[280px] text-xs text-muted-foreground leading-relaxed">
            Designing & engineering high-impact web architectures and native mobile applications.
          </p>
        </div>

        {/* Middle Side: Quick Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 max-w-md">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Right Side: Social links, Top action & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 shadow-xs"
              aria-label="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 shadow-xs"
              aria-label="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 cursor-pointer transition-all duration-300 shadow-xs"
              aria-label="Scroll back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
            &copy; {currentYear} Jabbar Khan. All rights reserved.
          </p>
          <a
            href="/admin/login"
            className="text-[9px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-pointer"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
