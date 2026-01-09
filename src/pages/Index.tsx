import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
    </Layout>
  );
};

export default Index;
