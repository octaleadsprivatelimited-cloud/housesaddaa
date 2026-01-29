import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, Award } from 'lucide-react';
import SEO from '@/components/SEO';

export default function About() {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about Houses Adda - India's trusted real estate platform. We connect property seekers with their dream homes across major cities with verified listings and expert support."
        url="/about"
      />
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About Houses Adda</h1>
          <p className="text-xl text-muted-foreground mb-12">
            India's trusted real estate platform connecting buyers, sellers, and renters.
          </p>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground mb-6">
              Houses Adda is a leading real estate platform in India, dedicated to making property 
              buying, selling, and renting simple and transparent. We connect property seekers with 
              their dream homes across major cities.
            </p>
            <p className="text-muted-foreground mb-6">
              Our mission is to revolutionize the real estate industry by providing a seamless, 
              user-friendly platform that empowers customers to make informed decisions about their 
              property investments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
                <p className="text-muted-foreground">
                  Browse thousands of properties across apartments, villas, plots, and commercial spaces.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of real estate experts is here to help you every step of the way.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Verified Listings</h3>
                <p className="text-muted-foreground">
                  All properties are verified to ensure authenticity and accuracy.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Trusted Platform</h3>
                <p className="text-muted-foreground">
                  Join thousands of satisfied customers who found their perfect property with us.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
