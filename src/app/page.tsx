import { HeroSecondary } from "@/components/sections/HeroSecondary";
import { ToolStrip } from "@/components/sections/ToolStrip";
import { StoryPanel } from "@/components/sections/StoryPanel";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { RangeSection } from "@/components/sections/RangeSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSecondary />
      <ToolStrip />
      <StoryPanel />
      <CaseStudiesSection />
      <RangeSection />
      <ApproachSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
