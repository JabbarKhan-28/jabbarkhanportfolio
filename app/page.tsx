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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full relative z-10">
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Expertise />
        <Achievements />
        <OtherProjects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
