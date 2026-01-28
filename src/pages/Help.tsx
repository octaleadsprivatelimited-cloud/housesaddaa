import { HelpCircle, MessageCircle, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Find answers to common questions and get support.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FAQs</h3>
              <p className="text-muted-foreground mb-4">
                Find answers to frequently asked questions about using our platform.
              </p>
              <Button variant="outline" size="sm">View FAQs</Button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-muted-foreground mb-4">
                Need help? Our support team is here to assist you.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guides</h3>
              <p className="text-muted-foreground mb-4">
                Learn how to use our platform with step-by-step guides.
              </p>
              <Button variant="outline" size="sm">View Guides</Button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@housesadda.in">Email Us</a>
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How do I search for properties?</h3>
                <p className="text-muted-foreground">
                  Use our search filters on the properties page to find properties by type, location, price, and more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I contact a property owner?</h3>
                <p className="text-muted-foreground">
                  Click on any property to view details and use the contact form or phone number provided.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are the property listings verified?</h3>
                <p className="text-muted-foreground">
                  Yes, we verify all property listings to ensure accuracy and authenticity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
