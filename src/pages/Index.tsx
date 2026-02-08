import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import { CategoryProperties } from '@/components/home/CategoryProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { YouTubeSection } from '@/components/home/YouTubeSection';
import { ClientsCarousel } from '@/components/home/ClientsCarousel';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';

const Index = () => {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Houses Adda',
    url: 'https://housesadda.in',
    logo: 'https://housesadda.in/logo.png',
    description: 'India\'s trusted real estate platform. Find apartments, villas, plots and commercial spaces across major cities.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-63015-75658',
      contactType: 'Customer Service',
      email: 'info@housesadda.in',
      areaServed: 'IN',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8-1-284-/ou/25, OU Colony, Shaikpet, Manikonda',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500104',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.octaleads.com'
    ]
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Houses Adda',
    url: 'https://housesadda.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://housesadda.in/properties?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <SEO 
        title="Houses Adda - Find Your Dream Home"
        description="India's trusted real estate platform. Find apartments, villas, plots and commercial spaces across major cities. Browse verified properties in Hyderabad, Bangalore, Mumbai, and more."
        url="/"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
      <HeroSection />
      <PropertyCategories />
      <AllPropertiesSection />
      <YouTubeSection />
      <CategoryProperties />
      <FeaturedListings />
      <WhyChooseUs />
      <ClientsCarousel />
    </>
  );
};

export default Index;
