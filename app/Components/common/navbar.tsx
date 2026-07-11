"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TextAlignJustify } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.png";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export const navigationData = [
  {
    title: "Home",
    href: "#home",
  },
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Experience",
    href: "#experience",
  },
  {
    title: "Tech Stack",
    href: "#tech-stack",
  },
  {
    title: "Skills",
    href: "#skills",
  },
  {
    title: "Achievements",
    href: "#achievements",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

const CollaborateButton = ({ className }: { className?: string }) => (
  <a href="#contact" className="w-fit shrink-0">
    <Button className={cn("relative text-xs font-semibold rounded-full h-10 p-1 ps-4 pe-11 group transition-all duration-300 hover:ps-11 hover:pe-4 w-fit overflow-hidden hover:bg-primary/95 cursor-pointer bg-primary text-primary-foreground", className)}>
      <span className="relative z-10 transition-all duration-300 hover:cursor-pointer">
        Let&apos;s Connect!
      </span>
      <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-300 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={14} />
      </div>
    </Button>
  </a>
);

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Sticky threshold
    setSticky(currentScrollY >= 50);

    // Scroll Progress bar
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (windowHeight > 0) {
      setScrollProgress((currentScrollY / windowHeight) * 100);
    }

    // Hide or Reveal nav
    if (currentScrollY > 120) {
      if (currentScrollY > lastScrollY) {
        // Scroll down
        setNavVisible(false);
      } else {
        // Scroll up
        setNavVisible(true);
      }
    } else {
      setNavVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // Scroll Spy Observer
  useEffect(() => {
    const sections = ["home", "projects", "about", "experience", "tech-stack", "skills", "achievements", "contact"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px", // Trigger active section when occupying upper center
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ease-out transform",
      navVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      {/* Top Page Scroll Progress Bar */}
      <div 
        className="h-[3px] bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-100 ease-out absolute top-0 left-0 z-50" 
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="max-w-7xl mx-auto w-full px-4 py-3 sm:px-8">
        <nav
          className={cn(
            "w-full flex items-center h-fit justify-between gap-4 lg:gap-8 transition-all duration-300",
            sticky
              ? "p-2 px-5 bg-card/80 backdrop-blur-md border border-border shadow-lg shadow-slate-200/5 rounded-full"
              : "bg-transparent border-transparent py-4"
          )}
        >
          <a href="#home" className="flex items-center gap-2 group shrink-0">
            <Image 
              src={Logo} 
              alt="Jabbar Khan logo" 
              width={34} 
              height={34} 
              className="rounded-full border border-primary/25 transition-transform group-hover:rotate-12 duration-500" 
            />
            <span className="text-xl font-bold font-heading text-gradient-blue tracking-tight">Jabbar</span>
          </a>

          {/* Navigation link elements */}
          <div className="hidden lg:block overflow-x-auto select-none">
            <NavigationMenu className="bg-muted/30 border border-border/80 backdrop-blur-sm p-1 rounded-full w-fit">
              <NavigationMenuList className="flex gap-1">
                {navigationData.map((navItem) => {
                  const itemKey = navItem.href.replace("#", "");
                  const isActive = activeSection === itemKey;
                  return (
                    <NavigationMenuItem key={navItem.title} className="relative">
                      <a
                        href={navItem.href}
                        className={cn(
                          "relative px-4 py-2 text-xs font-semibold rounded-full tracking-wide transition-colors block cursor-pointer z-10",
                          isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeNavbarIndicator"
                            className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm shadow-primary/20"
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          />
                        )}
                        <span className="relative z-10">{navItem.title}</span>
                      </a>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <CollaborateButton className="hidden lg:flex" />

          {/* Mobile responsive toggle */}
          <div className="lg:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="rounded-full bg-card border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-muted/40">
                <TextAlignJustify size={18} />
                <span className="sr-only">Toggle Menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52 mt-2 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg">
                {navigationData.map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <DropdownMenuItem
                      key={item.title}
                      className={cn(
                        "cursor-pointer rounded-lg m-1 transition-colors text-xs font-semibold py-2 px-3",
                        isActive
                          ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold"
                          : "text-muted-foreground focus:bg-muted/50 focus:text-foreground"
                      )}
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)} className="w-full">
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;