import Hero from "@/components/hero";
import CardsSection from "@/components/cardsSection";
import ScrollButton from "@/components/scrollButton";
import ExperienceSection from "./components/experience";
import GitHubComponent from "./components/gitHubStats";

function App() {
  return (
    <>
      <Hero />
      <CardsSection />
      <ExperienceSection />
      <ScrollButton />
      <GitHubComponent />
    </>
  );
}

export default App;
