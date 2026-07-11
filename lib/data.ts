import { prisma } from "./prisma";

// Fallback values in case the database is empty or throws an error
export const FALLBACK_HERO = {
  headline: "Designing &\nbuilding high-impact\nmobile & web apps.",
  subheading: "React Native mobile developer and Next.js web developer helping startups and modern brands create premium digital interfaces through technical precision, optimized codebases, and smooth micro-interactions.",
  typingText: ["React Native", "Next.js", "TypeScript", "Expo", "Redux Toolkit", "Zustand"],
  buttonText: "View Featured Work",
  buttonLink: "#projects",
  availabilityBadge: true,
  currentPosition: "App Developer Intern",
  currentCompany: "Zaryans Consulting",
  profileImage: "/uploads/JabbarKhanProfilePicture.jpg",
  backgroundImage: ""
};

export const FALLBACK_ABOUT = {
  profilePic: "/uploads/JabbarKhanProfilePicture.jpg",
  heroImage: "",
  biography: "Hello! I'm Jabbar Khan, a Software Engineer with production experience building cross-platform mobile and web applications using React Native, Next.js, TypeScript, and Expo. I specialize in architecting clean, maintainable component systems, integrating offline-first storage and Firebase API layers, implementing persistent auth flows, and shipping optimized release builds for Android, iOS, and web.",
  journey: "My professional focus lies in performance optimization, clean state transitions, and responsive user experiences — from buttery smooth gestures to SEO-optimized, highly structured web platforms. I am currently an App Developer Intern at Zaryans Consulting, working closely with senior engineering leads to maintain and ship scale-ready codebases.",
  mission: "To write clean, scale-ready codebases that deliver buttery smooth UX.",
  vision: "Developing state-of-the-art mobile and web architectures worldwide.",
  goals: ["Clean Scale Code", "UX First Principles", "Tech Curation"],
  stats: [
    { number: "1+ YR", label: "Experience" },
    { number: "5+", label: "Built Apps" },
    { number: "100%", label: "Commitment" }
  ],
  resumeUrl: "/JabbarKhanResume.pdf"
};

export const FALLBACK_CONTACT = {
  email: "jabbar118114@gmail.com",
  phone: "+92 312 8983602",
  address: "Pakistan (GMT+5) / Remote Worldwide",
  linkedin: "https://linkedin.com/in/jabbar-khan",
  github: "https://github.com/JabbarKhan-28",
  twitter: "",
  instagram: "",
  facebook: "",
  youtube: "",
  behance: "",
  dribbble: "",
  medium: "",
  devto: "",
  googleMap: "",
  businessHours: "9:00 AM - 6:00 PM (GMT+5)"
};

export const FALLBACK_SEO = {
  pageTitle: "Jabbar Khan | App and Web Developer",
  metaDescription: "Premium portfolio website for Jabbar Khan, a modern App and Web Developer focused on high-converting digital experiences.",
  keywords: "portfolio, App and Web Developer, App Developer, Web Developer, next.js, typescript, tailwind css",
  ogImage: "/uploads/JabbarKhanProfilePicture.jpg",
  twitterCard: "summary_large_image",
  canonicalUrl: "",
  robots: "index, follow",
  sitemap: "",
  favicon: "/favicon.ico",
  structuredData: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jabbar Khan",
    "jobTitle": "App and Web Developer",
    "url": "https://jabbarkhan.com"
  })
};

export const FALLBACK_APPEARANCE = {
  primaryColor: "oklch(0.55 0.18 250)",
  secondaryColor: "oklch(0.60 0.18 280)",
  accentColor: "oklch(0.65 0.15 200)",
  fontSans: "Inter",
  fontHeading: "Space Grotesk",
  borderRadius: "1.0rem",
  buttonStyle: "rounded-xl",
  animationSpeed: "normal",
  darkMode: true,
  gradientColors: "linear-gradient(135deg, oklch(0.65 0.18 250) 0%, oklch(0.55 0.18 250) 50%, oklch(0.60 0.18 280) 100%)",
  containerWidth: "max-w-6xl",
  sectionSpacing: "py-24",
  cardStyle: "glass-card",
  shadowStyle: "shadow-xs"
};

export const FALLBACK_SETTINGS = {
  websiteName: "Jabbar Khan Portfolio",
  logo: "/uploads/logo.png",
  favicon: "/favicon.ico",
  footerText: "Designing & engineering high-impact web architectures and native mobile applications.",
  copyright: "Jabbar Khan. All rights reserved.",
  resumeFile: "/JabbarKhanResume.pdf",
  maintenanceMode: false,
  analyticsId: "",
  googleSearchConsole: "",
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: ""
};

export const FALLBACK_PROJECTS = [
  {
    id: "doctorq",
    name: "DoctorQ — Doctor Appointment Platform",
    description: "A responsive web platform for doctor booking built with Next.js, Redux Toolkit, and persistent local storage schedules.",
    problem: "Patient appointment scheduling platforms often suffer from slow search updates, sluggish filters, and state loss on page reloads.",
    solution: "Designed a search-optimized web interface utilizing Next.js static page generation and dynamic routing to ensure immediate loading times.",
    architecture: "State is managed using Redux Toolkit for seamless global slot scheduling, synced with local storage persistence to prevent data loss.",
    challenges: "Encountered hydration mismatches and layout shifts when rendering local storage data on server-rendered Next.js grids. Resolved by setting up hydration guards and Skeleton components.",
    result: "Delivered a lightweight booking portal with high-speed performance scores and persistent offline calendar tracking.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "localStorage"],
    githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-nextjs",
    liveLink: "https://doctorq.vercel.app",
    image: "/uploads/JabbarKhanProfilePicture.jpg",
    gallery: [],
    displayOrder: 1,
    featured: true,
    published: true,
    category: "Web"
  },
  {
    id: "doctor-appointment-mobile",
    name: "Doctor Appointment App (Mobile)",
    description: "A cross-platform React Native & Expo healthcare application featuring offline scheduling synchronization with Firebase.",
    problem: "Mobile healthcare apps frequently hang or fail when users travel through low-signal areas, causing scheduling failures.",
    solution: "Engineered an offline-first mobile client using React Native and Expo, enabling smooth doctor browsing and booking cache.",
    architecture: "Integrated Zustand for lightweight client state management, AsyncStorage for offline caching, and Firebase client-side sync protocols.",
    challenges: "Synchronizing offline modifications back to Firestore on reconnecting without overriding concurrent appointments. Solved via conflict-resolution timestamps.",
    result: "Completed a reliable cross-platform app ensuring patients can manage appointments anywhere, even offline.",
    skills: ["React Native", "TypeScript", "Zustand", "AsyncStorage", "Firebase", "Expo"],
    githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
    liveLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
    image: "/uploads/JabbarKhanProfilePicture.jpg",
    gallery: [],
    displayOrder: 2,
    featured: true,
    published: true,
    category: "Mobile"
  },
  {
    id: "rn-animation-showcase",
    name: "React Native Animation Showcase",
    description: "A high-fidelity mobile showcase of advanced gestures and fluid Reanimated transitions maintaining a lock at 60 FPS.",
    problem: "Janky, stuttering transitions on mobile devices break the premium feel and reduce user retention rates.",
    solution: "Built a curated component library showcasing onboarding sliders, circular progress trackers, and interactive swipe lists.",
    architecture: "Utilizes declarative React Native Reanimated and Gesture Handler configs running computations directly on the native UI thread.",
    challenges: "JS-bridge overhead lagging the layout calculations. Resolved by removing bridge calls, binding all layout state using Reanimated Shared Values, and executing calculations on the UI worklets thread.",
    result: "Guaranteed smooth native-like performance, maintaining a lock on 60 FPS across both iOS and Android devices.",
    skills: ["React Native", "Reanimated 2", "Gesture Handler", "TypeScript", "Expo"],
    githubLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
    liveLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
    image: "/uploads/JabbarKhanProfilePicture.jpg",
    gallery: [],
    displayOrder: 3,
    featured: true,
    published: true,
    category: "Mobile"
  }
];

export const FALLBACK_SKILLS = [
  { name: "Next.js", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "1 year" },
  { name: "React.js", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years" },
  { name: "TypeScript", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years" },
  { name: "Tailwind CSS", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years" },
  
  { name: "React Native", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year" },
  { name: "Expo", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year" },
  { name: "TypeScript", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year" },
  
  { name: "Firebase Auth", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "1 year" },
  { name: "Cloud Firestore", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "1 year" },
  
  { name: "Git & GitHub", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "3 years" },
  { name: "Clean Code", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "2 years" }
];

export const FALLBACK_EXPERIENCES = [
  {
    type: "work",
    role: "App Developer Intern",
    company: "Zaryans Consulting Pvt Ltd",
    duration: "June 2026 – Present",
    icon: "Briefcase",
    points: [
      "Developing and maintaining production-grade cross-platform mobile apps with React Native, Expo, and TypeScript.",
      "Delivering secure local AsyncStorage databases, persistent authentication flows, and real-time Firebase-backed APIs.",
      "Collaborating in agile sprints alongside senior engineering leads to debug, optimize, and ship release builds for Android and iOS."
    ]
  },
  {
    type: "education",
    role: "Bachelor of Computer Science",
    company: "FAST NUCES University",
    duration: "September 2022 – June 2026",
    icon: "GraduationCap",
    points: [
      "Rigorous coursework in Data Structures, Database Systems, Software Engineering, and Object-Oriented Analysis.",
      "Built several desktop, web, and mobile utility projects as coursework, focusing on algorithm optimization and clean code principles.",
      "Developed a deep technical foundation in data modeling, state handling, and secure software design."
    ]
  }
];

export const FALLBACK_CERTIFICATIONS = [
  {
    title: "App Developer Intern Certification",
    issuer: "Zaryans Consulting Pvt Ltd",
    date: "2026",
    description: "Successfully recognized for contributing key engineering work in React Native mobile builds and integrating firebase backend sync.",
    icon: "Award",
    credentialUrl: ""
  },
  {
    title: "Dean's List of Academic Honors",
    issuer: "FAST NUCES University",
    date: "2023 – 2025",
    description: "Awarded Dean's List honors for maintaining high GPA standards throughout the computer science semesters.",
    icon: "Trophy",
    credentialUrl: ""
  }
];

export const FALLBACK_SERVICES = [
  { title: "Mobile App Development", description: "High-performance React Native & Expo mobile apps for iOS and Android.", icon: "Smartphone" },
  { title: "Full-Stack Web Apps", description: "SEO-optimized Next.js web applications with lightning fast load times.", icon: "Code2" },
  { title: "Database Architecture", description: "Design of secure, relational databases and client-side storage systems.", icon: "Database" }
];

export const FALLBACK_TESTIMONIALS = [
  { clientName: "Sarah Connor", company: "Cyberdyne Systems", role: "Product Manager", rating: 5, feedback: "Jabbar delivered our React Native app on time and with incredible responsiveness. The animations are beautiful!" },
  { clientName: "Tony Stark", company: "Stark Industries", role: "CEO", rating: 5, feedback: "His clean code and architectural practices in Next.js make the website easily maintainable. Outstanding engineer." }
];

export const FALLBACK_NAVIGATION = [
  { sectionId: "home", sectionName: "Home", label: "Home", href: "#home", visible: true },
  { sectionId: "projects", sectionName: "Projects", label: "Projects", href: "#projects", visible: true },
  { sectionId: "about", sectionName: "About", label: "About", href: "#about", visible: true },
  { sectionId: "experience", sectionName: "Experience", label: "Experience", href: "#experience", visible: true },
  { sectionId: "tech-stack", sectionName: "Tech Stack", label: "Tech Stack", href: "#tech-stack", visible: true },
  { sectionId: "skills", sectionName: "Skills", label: "Skills", href: "#skills", visible: true },
  { sectionId: "achievements", sectionName: "Achievements", label: "Achievements", href: "#achievements", visible: true },
  { sectionId: "contact", sectionName: "Contact", label: "Contact", href: "#contact", visible: true }
];

// Grouping details for categories
const CATEGORIES_META: Record<string, { description: string; icon: string; color: string }> = {
  "Frontend Engineering": {
    description: "Building responsive, fast, and SEO-optimized web applications with modern rendering patterns.",
    icon: "Code2",
    color: "text-primary"
  },
  "Mobile Development": {
    description: "Developing cross-platform native iOS & Android apps with a focus on fluid animations.",
    icon: "Smartphone",
    color: "text-secondary"
  },
  "Backend & Databases": {
    description: "Implementing client-side caching, offline local storage, and real-time backend structures.",
    icon: "Database",
    color: "text-emerald-500"
  },
  "Tools & Practices": {
    description: "Writing maintainable codebase architectures, debugging, and testing performance targets.",
    icon: "Wrench",
    color: "text-cyan-500"
  }
};

export async function getPortfolioData() {
  try {
    // 1. Fetch from Database
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" }
    });

    const skillsRaw = await prisma.skill.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" }
    });

    const experiences = await prisma.experience.findMany({
      orderBy: { displayOrder: "asc" }
    });

    const certifications = await prisma.certification.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" }
    });

    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" }
    });

    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" }
    });

    const heroRaw = await prisma.heroSection.findUnique({
      where: { id: "default" }
    });

    const aboutRaw = await prisma.aboutSection.findUnique({
      where: { id: "default" }
    });

    const contactRaw = await prisma.contactInfo.findUnique({
      where: { id: "default" }
    });

    const navigation = await prisma.navigationSetting.findMany({
      orderBy: { displayOrder: "asc" }
    });

    const seoRaw = await prisma.seoSetting.findUnique({
      where: { id: "default" }
    });

    const appearanceRaw = await prisma.appearanceSetting.findUnique({
      where: { id: "default" }
    });

    const settingsRaw = await prisma.siteSetting.findUnique({
      where: { id: "default" }
    });

    // 2. Parse JSON fields or format defaults
    const hero = heroRaw ? {
      ...heroRaw,
      typingText: JSON.parse(heroRaw.typingText || "[]")
    } : FALLBACK_HERO;

    const about = aboutRaw ? {
      ...aboutRaw,
      goals: JSON.parse(aboutRaw.goals || "[]"),
      stats: JSON.parse(aboutRaw.stats || "[]")
    } : FALLBACK_ABOUT;

    const contact = contactRaw || FALLBACK_CONTACT;
    const seo = seoRaw || FALLBACK_SEO;
    const appearance = appearanceRaw || FALLBACK_APPEARANCE;
    const settings = settingsRaw || FALLBACK_SETTINGS;

    const formattedProjects = projects.map(p => ({
      ...p,
      skills: p.skills ? p.skills.split(",") : [],
      gallery: JSON.parse(p.gallery || "[]")
    }));

    const formattedExperiences = experiences.map(e => ({
      ...e,
      points: JSON.parse(e.points || "[]")
    }));

    // Group skills by category for the frontend
    const groupedSkills = Object.keys(CATEGORIES_META).map(catTitle => {
      const meta = CATEGORIES_META[catTitle];
      const matchingSkills = skillsRaw
        .filter(s => s.category === catTitle)
        .map(s => s.name);
      
      return {
        title: catTitle,
        description: meta.description,
        iconName: meta.icon, // Return Lucide name string
        color: meta.color,
        skills: matchingSkills.length > 0 ? matchingSkills : (FALLBACK_SKILLS.filter(s => s.category === catTitle).map(s => s.name))
      };
    });

    // If database returned nothing for navigation, fallback
    const formattedNavigation = navigation.length > 0 ? navigation : FALLBACK_NAVIGATION;

    return {
      hero,
      about,
      contact,
      seo,
      appearance,
      settings,
      projects: formattedProjects.length > 0 ? formattedProjects : FALLBACK_PROJECTS,
      skills: groupedSkills,
      experiences: formattedExperiences.length > 0 ? formattedExperiences : FALLBACK_EXPERIENCES,
      certifications: certifications.length > 0 ? certifications : FALLBACK_CERTIFICATIONS,
      services: services.length > 0 ? services : FALLBACK_SERVICES,
      testimonials: testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS,
      navigation: formattedNavigation
    };
  } catch (error) {
    console.error("Database query error, falling back to static data:", error);
    
    // Map fallback skills
    const groupedSkills = Object.keys(CATEGORIES_META).map(catTitle => {
      const meta = CATEGORIES_META[catTitle];
      return {
        title: catTitle,
        description: meta.description,
        iconName: meta.icon,
        color: meta.color,
        skills: FALLBACK_SKILLS.filter(s => s.category === catTitle).map(s => s.name)
      };
    });

    return {
      hero: FALLBACK_HERO,
      about: FALLBACK_ABOUT,
      contact: FALLBACK_CONTACT,
      seo: FALLBACK_SEO,
      appearance: FALLBACK_APPEARANCE,
      settings: FALLBACK_SETTINGS,
      projects: FALLBACK_PROJECTS,
      skills: groupedSkills,
      experiences: FALLBACK_EXPERIENCES,
      certifications: FALLBACK_CERTIFICATIONS,
      services: FALLBACK_SERVICES,
      testimonials: FALLBACK_TESTIMONIALS,
      navigation: FALLBACK_NAVIGATION
    };
  }
}
