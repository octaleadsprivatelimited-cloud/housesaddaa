import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist. Return to Houses Adda homepage to browse properties."
        url={location.pathname}
        noindex={true}
      />
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/properties">
                <Search className="h-4 w-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Popular Pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about" className="text-primary hover:underline text-sm">About Us</Link>
              <Link to="/contact" className="text-primary hover:underline text-sm">Contact</Link>
              <Link to="/properties" className="text-primary hover:underline text-sm">Properties</Link>
              <Link to="/help" className="text-primary hover:underline text-sm">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
