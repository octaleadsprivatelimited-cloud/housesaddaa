import { Link } from 'react-router-dom';

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Find all pages and sections of our website.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-primary hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/properties" className="text-primary hover:underline">Properties</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Company</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-primary hover:underline">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
                </li>
                <li>
                  <Link to="/careers" className="text-primary hover:underline">Careers</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-primary hover:underline">Blog</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Properties</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/properties?type=sale" className="text-primary hover:underline">Buy Property</Link>
                </li>
                <li>
                  <Link to="/properties?type=rent" className="text-primary hover:underline">Rent Property</Link>
                </li>
                <li>
                  <Link to="/properties?status=under-construction" className="text-primary hover:underline">New Projects</Link>
                </li>
                <li>
                  <Link to="/properties?propertyType=commercial" className="text-primary hover:underline">Commercial</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Support</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-primary hover:underline">Help Center</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <a href="/sitemap.xml" className="text-primary hover:underline">XML Sitemap</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
