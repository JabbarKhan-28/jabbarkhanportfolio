import { StaticImageData } from "next/image";
import ProjectImg from "../../assets/JabbarKhanProfilePicture.jpg";

export interface Project {
  id: string;
  name: string;
  description: string;
  image: StaticImageData;
  skills: string[];
  githubLink: string;
  liveLink: string;
  // Case Study fields for high-impact project storytelling
  problem: string;
  solution: string;
  architecture: string;
  challenges: string;
  result: string;
}

export const projectsData: Project[] = [
  {
    id: "doctorq",
    name: "DoctorQ — Doctor Appointment Platform",
    description: "A responsive web platform for doctor booking built with Next.js, Redux Toolkit, and persistent local storage schedules.",
    image: ProjectImg,
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "localStorage"],
    githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-nextjs",
    liveLink: "https://doctorq.vercel.app",
    problem: "Patient appointment scheduling platforms often suffer from slow search updates, sluggish filters, and state loss on page reloads.",
    solution: "Designed a search-optimized web interface utilizing Next.js static page generation and dynamic routing to ensure immediate loading times.",
    architecture: "State is managed using Redux Toolkit for seamless global slot scheduling, synced with local storage persistence to prevent data loss.",
    challenges: "Encountered hydration mismatches and layout shifts when rendering local storage data on server-rendered Next.js grids. Resolved by setting up hydration guards and Skeleton components.",
    result: "Delivered a lightweight booking portal with high-speed performance scores and persistent offline calendar tracking.",
  },
  {
    id: "doctor-appointment-mobile",
    name: "Doctor Appointment App (Mobile)",
    description: "A cross-platform React Native & Expo healthcare application featuring offline scheduling synchronization with Firebase.",
    image: ProjectImg,
    skills: ["React Native", "TypeScript", "Zustand", "AsyncStorage", "Firebase", "Expo"],
    githubLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
    liveLink: "https://github.com/JabbarKhan-28/doctor-appointment-react-native",
    problem: "Mobile healthcare apps frequently hang or fail when users travel through low-signal areas, causing scheduling failures.",
    solution: "Engineered an offline-first mobile client using React Native and Expo, enabling smooth doctor browsing and booking cache.",
    architecture: "Integrated Zustand for lightweight client state management, AsyncStorage for offline caching, and Firebase client-side sync protocols.",
    challenges: "Synchronizing offline modifications back to Firestore on reconnecting without overriding concurrent appointments. Solved via conflict-resolution timestamps.",
    result: "Completed a reliable cross-platform app ensuring patients can manage appointments anywhere, even offline.",
  },
  {
    id: "rn-animation-showcase",
    name: "React Native Animation Showcase",
    description: "A high-fidelity mobile showcase of advanced gestures and fluid Reanimated transitions maintaining a lock at 60 FPS.",
    image: ProjectImg,
    skills: ["React Native", "Reanimated 2", "Gesture Handler", "TypeScript", "Expo"],
    githubLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
    liveLink: "https://github.com/JabbarKhan-28/react-native-animation-showcase",
    problem: "Janky, stuttering transitions on mobile devices break the premium feel and reduce user retention rates.",
    solution: "Built a curated component library showcasing onboarding sliders, circular progress trackers, and interactive swipe lists.",
    architecture: "Utilizes declarative React Native Reanimated and Gesture Handler configs running computations directly on the native UI thread.",
    challenges: "JS-bridge overhead lagging the layout calculations. Resolved by removing bridge calls, binding all layout state using Reanimated Shared Values, and executing calculations on the UI worklets thread.",
    result: "Guaranteed smooth native-like performance, maintaining a lock on 60 FPS across both iOS and Android devices.",
  },
  {
    id: "cyber-talk",
    name: "Cyber Talk — Encrypted Messaging App",
    description: "A secure real-time messaging application using RSA encryption for client-side message privacy, with Firebase Authentication and Firestore powering real-time chat.",
    image: ProjectImg,
    skills: ["React Native", "TypeScript", "Firebase", "RSA Encryption"],
    githubLink: "https://github.com/JabbarKhan-28/cyber-talk-chat-app",
    liveLink: "https://github.com/JabbarKhan-28/cyber-talk-chat-app",
    problem: "Direct database storage of messages poses security threats and compromises message confidentiality.",
    solution: "Built a cryptographic chatting client executing end-to-end RSA encryption on messages before sending.",
    architecture: "React Native client executing key generation, Firestore storing public keys and encrypted packages, and Firebase Auth guarding entries.",
    challenges: "Performance latency during RSA key creation on lower-end devices. Handled by executing generation asynchronously in background tasks.",
    result: "Delivered a lightweight security-first real-time chat application with zero cleartext message database storage.",
  },
  {
    id: "cypher-chest",
    name: "Cypher Chest",
    description: "A cryptography utility app supporting multiple encryption and decryption algorithms with educational step-by-step explanations.",
    image: ProjectImg,
    skills: ["React Native", "TypeScript"],
    githubLink: "https://github.com/JabbarKhan-28/cypher-chest",
    liveLink: "https://github.com/JabbarKhan-28/cypher-chest",
    problem: "A lack of visual representation makes cryptographic concepts difficult for students to comprehend.",
    solution: "Developed an educational tool visualizing cipher operations step-by-step.",
    architecture: "Modular TypeScript classes for cipher algorithms like Caesar, Vigenère, and AES, bound to interactive state nodes.",
    challenges: "Structuring cipher transformations to display intermediate states in a clean, legible sequence. Solved using clean iterative mapping.",
    result: "Designed an interactive utility that successfully educates users on core cryptographic practices.",
  },
];
