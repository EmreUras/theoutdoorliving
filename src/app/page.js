import HeroSection from "@/components/HeroSection";
// import PortfolioSection from "@/components/PortfolioSection";

import ServicesDemo from "@/components/ServicesDemo";
import Testimonials from "@/components/Testimonials";
import FooterPage from "@/components/FooterPage";

import BeforeAfterGrid from "@/components/BeforeAfterGrid";
import BeforeAfterVideosSection from "@/components/BeforeAfterVideosSection";
import GeneralProjectsSection from "@/components/GeneralProjectsSection";

export default function Home() {
  return (
    <>
      <div className="mt-20 md:mt-24 lg:mt-25">
        <HeroSection />
      </div>

      <div className="mt-12 md:mt-24 lg:mt-32">
        <ServicesDemo />
      </div>
      <div id="portfolio" className="mt-12 md:mt-24 lg:mt-32">
        <BeforeAfterGrid />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <BeforeAfterVideosSection />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <GeneralProjectsSection />
      </div>

      {/* <div className="mt-12 md:mt-24 lg:mt-32">
        <PortfolioSection />
      </div> */}
      <div className="mt-12 md:mt-24 lg:mt-32">
        <Testimonials />
      </div>
      <div className="mt-12 md:mt-24 lg:mt-32">
        <FooterPage />
      </div>
    </>
  );
}
