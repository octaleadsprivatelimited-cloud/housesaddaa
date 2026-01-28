import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Careers</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Join our team and help shape the future of real estate in India.
          </p>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground mb-6">
              At Houses Adda, we're building a platform that makes property search simple and transparent. 
              We're looking for passionate individuals who want to make a difference in the real estate industry.
            </p>
            <p className="text-muted-foreground mb-6">
              We offer competitive salaries, a great work environment, and opportunities for growth. 
              If you're interested in joining our team, please check out our open positions below.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real Estate Sales Executive</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Full-time
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Hyderabad
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      2-5 years
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                We're looking for an experienced sales executive to help our clients find their dream properties.
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">Apply Now</Link>
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Property Listing Manager</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Full-time
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Remote
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      3+ years
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Manage and optimize property listings to ensure the best experience for our users.
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">Apply Now</Link>
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Don't see a role that fits?</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
