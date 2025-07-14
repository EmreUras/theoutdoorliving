import HeroSection from "@/components/HeroSection";
import ServicesDemo from "@/components/ServicesDemo";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* give us some breathing room */}
      <div className="mt-0 lg:mt-50">
        <ServicesDemo />
      </div>
    </>
  );
}
