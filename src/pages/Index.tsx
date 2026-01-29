import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { CategoryProperties } from '@/components/home/CategoryProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <CategoryProperties />
      <WhyChooseUs />
      <CTASection />
    </>
  );
};

export default Index;
