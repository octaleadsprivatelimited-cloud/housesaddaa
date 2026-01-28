import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { CategoryProperties } from '@/components/home/CategoryProperties';
import { TopCities } from '@/components/home/TopCities';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <CategoryProperties />
      <TopCities />
      <WhyChooseUs />
      <CTASection />
    </>
  );
};

export default Index;
