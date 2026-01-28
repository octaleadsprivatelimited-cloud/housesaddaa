import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { TopCities } from '@/components/home/TopCities';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <TopCities />
      <WhyChooseUs />
      <CTASection />
    </>
  );
};

export default Index;
