import Navbar from "./Components/common/navbar";
import Hero from "./Components/Hero/hero";
import Projects from "./Components/projects/projects";
import About from "./Components/about/about";
import Experience from "./Components/experience/experience";
import Expertise from "./Components/skills/expertise";
import Achievements from "./Components/achievements/achievements";
import OtherProjects from "./Components/projects/otherProjects";
import Contact from "./Components/contacts/contact";
import Footer from "./Components/common/footer";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [
    heroData,
    aboutData,
    contactData,
    projects,
    skills,
    experiences,
    certifications,
    services,
    testimonials,
    navigation,
  ] = await Promise.all([
    prisma.heroSection.findUnique({ where: { id: "default" } }).catch(() => null),
    prisma.aboutSection.findUnique({ where: { id: "default" } }).catch(() => null),
    prisma.contactInfo.findUnique({ where: { id: "default" } }).catch(() => null),
    prisma.project.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.skill.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.experience.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.certification.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.service.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.navigationSetting.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
  ]);

  return (
    <>
      <Navbar navigationData={navigation.length > 0 ? navigation : undefined} />
      <main className="w-full relative z-10">
        <Hero heroData={heroData || undefined} aboutData={aboutData || undefined} />
        <Projects projectsData={projects.length > 0 ? projects : undefined} />
        <About aboutData={aboutData || undefined} />
        <Experience experienceData={experiences.length > 0 ? experiences : undefined} />
        <Expertise skillsData={skills.length > 0 ? skills : undefined} servicesData={services.length > 0 ? services : undefined} />
        <Achievements achievementsData={certifications.length > 0 ? certifications : undefined} />
        <OtherProjects projectsData={projects.length > 0 ? projects : undefined} />
        <Contact contactData={contactData || undefined} />
        <Footer contactData={contactData || undefined} />
      </main>
    </>
  );
}
