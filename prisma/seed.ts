import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import crypto from "crypto";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to hash password matching our auth.ts logic
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  const adminEmail = "jabbar@portfolio.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingUser) {
    const passwordHash = hashPassword("JabbHaream28");
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Jabbar Khan",
        role: "Super Admin"
      }
    });
    console.log("Created default admin user: admin@portfolio.com / admin123");
  }

  // 2. Seeding NavigationSettings
  const navigationSections = [
    { sectionId: "home", sectionName: "Home", label: "Home", href: "#home", visible: true, displayOrder: 1 },
    { sectionId: "projects", sectionName: "Projects", label: "Projects", href: "#projects", visible: true, displayOrder: 2 },
    { sectionId: "about", sectionName: "About", label: "About", href: "#about", visible: true, displayOrder: 3 },
    { sectionId: "experience", sectionName: "Experience", label: "Experience", href: "#experience", visible: true, displayOrder: 4 },
    { sectionId: "tech-stack", sectionName: "Tech Stack", label: "Tech Stack", href: "#tech-stack", visible: true, displayOrder: 5 },
    { sectionId: "skills", sectionName: "Skills", label: "Skills", href: "#skills", visible: true, displayOrder: 6 },
    { sectionId: "achievements", sectionName: "Achievements", label: "Achievements", href: "#achievements", visible: true, displayOrder: 7 },
    { sectionId: "contact", sectionName: "Contact", label: "Contact", href: "#contact", visible: true, displayOrder: 8 }
  ];

  for (const nav of navigationSections) {
    await prisma.navigationSetting.upsert({
      where: { sectionId: nav.sectionId },
      update: nav,
      create: nav
    });
  }
  console.log("Seeded navigation links");

  // 3. Seeding HeroSection
  const defaultHero = {
    id: "default",
    headline: "Designing &\nbuilding high-impact\nmobile & web apps.",
    subheading: "React Native mobile developer and Next.js web developer helping startups and modern brands create premium digital interfaces through technical precision, optimized codebases, and smooth micro-interactions.",
    typingText: JSON.stringify(["React Native", "Next.js", "TypeScript", "Expo", "Redux Toolkit", "Zustand"]),
    buttonText: "View Featured Work",
    buttonLink: "#projects",
    availabilityBadge: true,
    currentPosition: "App Developer Intern",
    currentCompany: "Zaryans Consulting",
    profileImage: "/uploads/JabbarKhanProfilePicture.jpg",
    backgroundImage: ""
  };
  await prisma.heroSection.upsert({
    where: { id: "default" },
    update: defaultHero,
    create: defaultHero
  });
  console.log("Seeded Hero settings");

  // 4. Seeding AboutSection
  const defaultAbout = {
    id: "default",
    profilePic: "/uploads/JabbarKhanProfilePicture.jpg",
    heroImage: "",
    biography: "Hello! I'm Jabbar Khan, a Software Engineer with production experience building cross-platform mobile and web applications using React Native, Next.js, TypeScript, and Expo. I specialize in architecting clean, maintainable component systems, integrating offline-first storage and Firebase API layers, implementing persistent auth flows, and shipping optimized release builds for Android, iOS, and web.",
    journey: "My professional focus lies in performance optimization, clean state transitions, and responsive user experiences — from buttery smooth gestures to SEO-optimized, highly structured web platforms. I am currently an App Developer Intern at Zaryans Consulting, working closely with senior engineering leads to maintain and ship scale-ready codebases.",
    mission: "To write clean, scale-ready codebases that deliver buttery smooth UX.",
    vision: "Developing state-of-the-art mobile and web architectures worldwide.",
    goals: JSON.stringify(["Clean Scale Code", "UX First Principles", "Tech Curation"]),
    stats: JSON.stringify([
      { number: "1+ YR", label: "Experience" },
      { number: "5+", label: "Built Apps" },
      { number: "100%", label: "Commitment" }
    ]),
    resumeUrl: "/JabbarKhanResume.pdf"
  };
  await prisma.aboutSection.upsert({
    where: { id: "default" },
    update: defaultAbout,
    create: defaultAbout
  });
  console.log("Seeded About settings");

  // 5. Seeding ContactInfo
  const defaultContact = {
    id: "default",
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
  await prisma.contactInfo.upsert({
    where: { id: "default" },
    update: defaultContact,
    create: defaultContact
  });
  console.log("Seeded Contact settings");

  // 6. Seeding SEO settings
  const defaultSeo = {
    id: "default",
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
      "url": "https://jabbarkhan.com",
      "sameAs": [
        "https://github.com/JabbarKhan-28",
        "https://linkedin.com/in/jabbar-khan"
      ]
    })
  };
  await prisma.seoSetting.upsert({
    where: { id: "default" },
    update: defaultSeo,
    create: defaultSeo
  });
  console.log("Seeded SEO settings");

  // 7. Seeding Appearance settings
  const defaultAppearance = {
    id: "default",
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
  await prisma.appearanceSetting.upsert({
    where: { id: "default" },
    update: defaultAppearance,
    create: defaultAppearance
  });
  console.log("Seeded Appearance settings");

  // 8. Seeding SiteSettings
  const defaultSite = {
    id: "default",
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
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: defaultSite,
    create: defaultSite
  });
  console.log("Seeded Site settings");

  // 9. Seeding Projects
  const defaultProjects = [
    {
      id: "doctorq",
      name: "DoctorQ — Doctor Appointment Platform",
      description: "A responsive web platform for doctor booking built with Next.js, Redux Toolkit, and persistent local storage schedules.",
      problem: "Patient appointment scheduling platforms often suffer from slow search updates, sluggish filters, and state loss on page reloads.",
      solution: "Designed a search-optimized web interface utilizing Next.js static page generation and dynamic routing to ensure immediate loading times.",
      architecture: "State is managed using Redux Toolkit for seamless global slot scheduling, synced with local storage persistence to prevent data loss.",
      challenges: "Encountered hydration mismatches and layout shifts when rendering local storage data on server-rendered Next.js grids. Resolved by setting up hydration guards and Skeleton components.",
      result: "Delivered a lightweight booking portal with high-speed performance scores and persistent offline calendar tracking.",
      skills: "Next.js,TypeScript,Tailwind CSS,Redux Toolkit,localStorage",
      githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-nextjs",
      liveLink: "https://doctorq.vercel.app",
      image: "/uploads/JabbarKhanProfilePicture.jpg",
      gallery: JSON.stringify([]),
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
      skills: "React Native,TypeScript,Zustand,AsyncStorage,Firebase,Expo",
      githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
      liveLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
      image: "/uploads/JabbarKhanProfilePicture.jpg",
      gallery: JSON.stringify([]),
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
      skills: "React Native,Reanimated 2,Gesture Handler,TypeScript,Expo",
      githubLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
      liveLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
      image: "/uploads/JabbarKhanProfilePicture.jpg",
      gallery: JSON.stringify([]),
      displayOrder: 3,
      featured: true,
      published: true,
      category: "Mobile"
    },
    {
      id: "cyber-talk",
      name: "Cyber Talk — Encrypted Messaging App",
      description: "A secure real-time messaging application using RSA encryption for client-side message privacy, with Firebase Authentication and Firestore powering real-time chat.",
      problem: "Direct database storage of messages poses security threats and compromises message confidentiality.",
      solution: "Built a cryptographic chatting client executing end-to-end RSA encryption on messages before sending.",
      architecture: "React Native client executing key generation, Firestore storing public keys and encrypted packages, and Firebase Auth guarding entries.",
      challenges: "Performance latency during RSA key creation on lower-end devices. Handled by executing generation asynchronously in background tasks.",
      result: "Delivered a lightweight security-first real-time chat application with zero cleartext message database storage.",
      skills: "React Native,TypeScript,Firebase,RSA Encryption",
      githubLink: "https://github.com/JabbarKhan-28/cyber-talk-chat-app",
      liveLink: "https://github.com/JabbarKhan-28/cyber-talk-chat-app",
      image: "/uploads/JabbarKhanProfilePicture.jpg",
      gallery: JSON.stringify([]),
      displayOrder: 4,
      featured: false,
      published: true,
      category: "Mobile"
    },
    {
      id: "cypher-chest",
      name: "Cypher Chest",
      description: "A cryptography utility app supporting multiple encryption and decryption algorithms with educational step-by-step explanations.",
      problem: "A lack of visual representation makes cryptographic concepts difficult for students to comprehend.",
      solution: "Developed an educational tool visualizing cipher operations step-by-step.",
      architecture: "Modular TypeScript classes for cipher algorithms like Caesar, Vigenère, and AES, bound to interactive state nodes.",
      challenges: "Structuring cipher transformations to display intermediate states in a clean, legible sequence. Solved using clean iterative mapping.",
      result: "Designed an interactive utility that successfully educates users on core cryptographic practices.",
      skills: "React Native,TypeScript",
      githubLink: "https://github.com/JabbarKhan-28/cypher-chest",
      liveLink: "https://github.com/JabbarKhan-28/cypher-chest",
      image: "/uploads/JabbarKhanProfilePicture.jpg",
      gallery: JSON.stringify([]),
      displayOrder: 5,
      featured: false,
      published: true,
      category: "Mobile"
    }
  ];

  for (const proj of defaultProjects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj
    });
  }
  console.log("Seeded default projects");

  // 10. Seeding Skills
  const defaultSkills = [
    { name: "Next.js", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "1 year", displayOrder: 1 },
    { name: "React.js", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years", displayOrder: 2 },
    { name: "TypeScript", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years", displayOrder: 3 },
    { name: "Tailwind CSS", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "2 years", displayOrder: 4 },
    { name: "Redux Toolkit", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "1 year", displayOrder: 5 },
    { name: "HTML5 & CSS3", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "3 years", displayOrder: 6 },
    
    { name: "React Native", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year", displayOrder: 7 },
    { name: "Expo", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year", displayOrder: 8 },
    { name: "TypeScript", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year", displayOrder: 9 },
    { name: "Reanimated 2", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year", displayOrder: 10 },
    { name: "Gesture Handler", icon: "Smartphone", color: "text-secondary", category: "Mobile Development", yearsExperience: "1 year", displayOrder: 11 },
    
    { name: "Firebase Auth", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "1 year", displayOrder: 12 },
    { name: "Cloud Firestore", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "1 year", displayOrder: 13 },
    { name: "AsyncStorage", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "2 years", displayOrder: 14 },
    { name: "localStorage", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "2 years", displayOrder: 15 },
    { name: "REST APIs", icon: "Database", color: "text-emerald-500", category: "Backend & Databases", yearsExperience: "2 years", displayOrder: 16 },
    
    { name: "Git & GitHub", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "3 years", displayOrder: 17 },
    { name: "Clean Code", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "2 years", displayOrder: 18 },
    { name: "VS Code", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "3 years", displayOrder: 19 },
    { name: "Performance Audit", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "1 year", displayOrder: 20 },
    { name: "API Integration", icon: "Wrench", color: "text-cyan-500", category: "Tools & Practices", yearsExperience: "2 years", displayOrder: 21 }
  ];

  for (let i = 0; i < defaultSkills.length; i++) {
    const s = defaultSkills[i];
    const existing = await prisma.skill.findFirst({
      where: { name: s.name, category: s.category }
    });
    if (!existing) {
      await prisma.skill.create({
        data: s
      });
    }
  }
  console.log("Seeded skills");

  // 11. Seeding Experiences
  const defaultExperiences = [
    {
      type: "work",
      role: "App Developer Intern",
      company: "Zaryans Consulting Pvt Ltd",
      duration: "June 2026 – Present",
      icon: "Briefcase",
      points: JSON.stringify([
        "Developing and maintaining production-grade cross-platform mobile apps with React Native, Expo, and TypeScript.",
        "Delivering secure local AsyncStorage databases, persistent authentication flows, and real-time Firebase-backed APIs.",
        "Collaborating in agile sprints alongside senior engineering leads to debug, optimize, and ship release builds for Android and iOS."
      ]),
      displayOrder: 1
    },
    {
      type: "education",
      role: "Bachelor of Computer Science",
      company: "FAST NUCES University",
      duration: "September 2022 – June 2026",
      icon: "GraduationCap",
      points: JSON.stringify([
        "Rigorous coursework in Data Structures, Database Systems, Software Engineering, and Object-Oriented Analysis.",
        "Built several desktop, web, and mobile utility projects as coursework, focusing on algorithm optimization and clean code principles.",
        "Developed a deep technical foundation in data modeling, state handling, and secure software design."
      ]),
      displayOrder: 2
    }
  ];

  for (const exp of defaultExperiences) {
    const existing = await prisma.experience.findFirst({
      where: { role: exp.role, company: exp.company }
    });
    if (!existing) {
      await prisma.experience.create({
        data: exp
      });
    }
  }
  console.log("Seeded default experiences");

  // 12. Seeding Achievements/Certifications
  const defaultAchievements = [
    {
      title: "App Developer Intern Certification",
      issuer: "Zaryans Consulting Pvt Ltd",
      date: "2026",
      description: "Successfully recognized for contributing key engineering work in React Native mobile builds and integrating firebase backend sync.",
      icon: "Award",
      credentialUrl: "",
      image: "",
      displayOrder: 1
    },
    {
      title: "Dean's List of Academic Honors",
      issuer: "FAST NUCES University",
      date: "2023 – 2025",
      description: "Awarded Dean's List honors for maintaining high GPA standards throughout the computer science semesters.",
      icon: "Trophy",
      credentialUrl: "",
      image: "",
      displayOrder: 2
    },
    {
      title: "App Store & Play Store Deployment",
      issuer: "Mobile Application Publishing",
      date: "2025",
      description: "Configured and successfully published test builds and packages to both Google Play Console and Apple App Store Connect.",
      icon: "Smartphone",
      credentialUrl: "",
      image: "",
      displayOrder: 3
    },
    {
      title: "GitHub Student Developer Partner",
      issuer: "GitHub Education",
      date: "2024",
      description: "Accepted into the developer pack program, leveraging advanced student developer environments and building portfolio systems.",
      icon: "Github",
      credentialUrl: "",
      image: "",
      displayOrder: 4
    }
  ];

  for (const ach of defaultAchievements) {
    const existing = await prisma.certification.findFirst({
      where: { title: ach.title, issuer: ach.issuer }
    });
    if (!existing) {
      await prisma.certification.create({
        data: ach
      });
    }
  }
  console.log("Seeded default certifications/achievements");

  // 13. Seed Services (Placeholder)
  const defaultServices = [
    { title: "Mobile App Development", description: "High-performance React Native & Expo mobile apps for iOS and Android.", icon: "Smartphone", displayOrder: 1, published: true },
    { title: "Full-Stack Web Apps", description: "SEO-optimized Next.js web applications with lightning fast load times.", icon: "Code2", displayOrder: 2, published: true },
    { title: "Database Architecture", description: "Design of secure, relational databases and client-side storage systems.", icon: "Database", displayOrder: 3, published: true }
  ];
  for (const s of defaultServices) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }
  console.log("Seeded services");

  // 14. Seed Testimonials (Placeholder)
  const defaultTestimonials = [
    { clientName: "Sarah Connor", company: "Cyberdyne Systems", role: "Product Manager", rating: 5, feedback: "Jabbar delivered our React Native app on time and with incredible responsiveness. The animations are beautiful!", published: true, displayOrder: 1 },
    { clientName: "Tony Stark", company: "Stark Industries", role: "CEO", rating: 5, feedback: "His clean code and architectural practices in Next.js make the website easily maintainable. Outstanding engineer.", published: true, displayOrder: 2 }
  ];
  for (const t of defaultTestimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Seeded testimonials");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
