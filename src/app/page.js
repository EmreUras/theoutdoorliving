import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";

import ServicesDemo from "@/components/ServicesDemo";
import Testimonials from "@/components/Testimonials";
import FooterPage from "@/components/FooterPage";

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="mt-12 md:mt-24 lg:mt-32">
        <ServicesDemo />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <PortfolioSection />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <Testimonials />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <FooterPage />
      </div>
    </>
  );
}
