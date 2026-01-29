import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

export default function Blog() {
  return (
    <>
      <SEO 
        title="Blog"
        description="Latest insights, tips, and news about real estate in India. Stay updated with market trends, buying guides, and expert advice from Houses Adda."
        url="/blog"
      />
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Latest insights, tips, and news about real estate in India.
          </p>

          <div className="space-y-8">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Coming soon
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Houses Adda Team
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  We're working on bringing you the latest real estate news, market insights, 
                  buying guides, and expert tips. Check back soon for our first blog posts!
                </p>
                <Button variant="outline" asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
