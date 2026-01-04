import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { VenueShowcase } from "@/components/home/VenueShowcase";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <VenueShowcase />
      <ServicesPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
