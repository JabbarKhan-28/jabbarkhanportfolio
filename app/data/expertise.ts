import { StaticImageData } from "next/image";
import ProfileImg from "../../assets/JabbarKhanProfilePicture.jpg";

export interface Expertise {
  id: string;
  name: string;
  description: string;
  image: StaticImageData;
  skills: string[];
  githubLink: string;
  liveLink: string;
}

export const expertiseData: Expertise[] = [
  {
    id: "mobile-app-dev",
    name: "Mobile App Development",
    description: "Developing cross-platform native iOS & Android applications using React Native and Expo. Expert in high-performance animations, gesture handling, and Firebase-backed features.",
    image: ProfileImg,
    skills: ["React Native", "Expo", "TypeScript", "Reanimated", "Firebase"],
    githubLink: "[ADD LINK]",
    liveLink: "[ADD LINK]",
  },
  {
    id: "web-dev-nextjs",
    name: "Web Development with Next.js",
    description: "Building modern, responsive web applications with the latest Next.js. Focused on clean UI with Tailwind CSS, state management, and clean codebase organization.",
    image: ProfileImg,
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
    githubLink: "[ADD LINK]",
    liveLink: "[ADD LINK]",
  },
  {
    id: "state-mgmt-auth",
    name: "State Management & Authentication",
    description: "Architecting scalable state management solutions and implementing secure, persistent authentication flows across mobile and web platforms.",
    image: ProfileImg,
    skills: ["Zustand", "Redux", "Firebase Auth", "AsyncStorage"],
    githubLink: "[ADD LINK]",
    liveLink: "[ADD LINK]",
  },
  {
    id: "eng-practices",
    name: "Engineering Practices",
    description: "Component architecture, cross-platform development, debugging, and performance optimization — writing maintainable code built to scale.",
    image: ProfileImg,
    skills: ["Git", "GitHub", "Clean Code", "Performance Optimization", "API Integration"],
    githubLink: "[ADD LINK]",
    liveLink: "[ADD LINK]",
  },
];
