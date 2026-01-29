import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, Phone, 
  BadgeCheck, Calendar, Eye, MessageSquare, ArrowLeft,
  Car, Dumbbell, Waves, Shield, Zap, Building2, Loader2, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, amenities as amenitiesData, getPropertyTypeLabel } from '@/data/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { getPropertyBySlug, getPropertiesByType } from '@/services/propertyService';
import SEO from '@/components/SEO';

const amenityIcons: Record<string, React.ElementType> = {
  parking: Car,
  gym: Dumbbell,
  'swimming-pool': Waves,
  security: Shield,
  'power-backup': Zap,
  lift: Building2,
};

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const data = await getPropertyBySlug(slug);
        setProperty(data);
        
        // Fetch similar properties if we found the main property
        if (data) {
          const similar = await getPropertiesByType(data.propertyType, 3);
          // Filter out the current property
          setSimilarProperties(similar.filter(p => p.id !== data.id));
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Button asChild>
            <Link to="/properties">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  // SEO data
  const seoTitle = property.metaTitle || `${property.title} - ${property.location.city} | Houses Adda`;
  const seoDescription = property.metaDescription || 
    `${property.title} in ${property.location.area}, ${property.location.city}. ${property.listingType === 'sale' ? 'Buy' : 'Rent'} this ${getPropertyTypeLabel(property.propertyType)} for ${formatPrice(property.price, property.listingType)}. ${property.description.substring(0, 100)}...`;
  const seoImage = property.images[0] || '/logo.png';
  const seoUrl = `/property/${property.slug}`;

  // Structured Data for Property
  const propertyStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location.area,
      addressLocality: property.location.city,
      addressRegion: property.location.state,
      addressCountry: property.location.country
    },
    price: property.price,
    priceCurrency: 'INR',
    availability: property.propertyStatus === 'ready' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    category: getPropertyTypeLabel(property.propertyType),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: property.areaUnit === 'sqft' ? 'SFT' : 'MTK'
    },
    url: `https://housesadda.in${seoUrl}`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: property.propertyStatus === 'ready' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url: `https://housesadda.in${seoUrl}`
    }
  };

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        type="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyStructuredData) }} />
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border py-4">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/properties" className="text-muted-foreground hover:text-primary">Properties</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{property.location.city}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={property.images[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={property.listingType === 'sale' ? 'badge-sale' : 'badge-rent'}>
                    For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
                  </Badge>
                  {property.isVerified && (
                    <Badge className="bg-success text-success-foreground">
                      <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        'w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all',
                        activeImageIndex === index ? 'border-primary' : 'border-transparent opacity-70'
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.location.area}, {property.location.city}, {property.location.state}
                  </div>
                </div>
                <div className="text-right">
                  <div className="price-display text-3xl">
                    {formatPrice(property.price, property.listingType)}
                  </div>
                  {property.pricePerSqft && (
                    <div className="text-sm text-muted-foreground">
                      ₹{property.pricePerSqft.toLocaleString()} per sqft
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="font-semibold">{property.area.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{property.areaUnit}</div>
                </div>
                <div className="text-center">
                  <Building2 className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="font-semibold">{getPropertyTypeLabel(property.propertyType)}</div>
                  <div className="text-sm text-muted-foreground">Type</div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <span className="text-muted-foreground text-sm">Furnishing</span>
                  <div className="font-medium capitalize">{property.furnishing.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Status</span>
                  <div className="font-medium capitalize">{property.propertyStatus.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Listed</span>
                  <div className="font-medium">{property.postedAt.toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Views</span>
                  <div className="font-medium">{property.views.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              
              {property.features && property.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((amenityIdOrName) => {
                  // Check if it's an ID (numeric string) or a name/slug
                  const amenityData = amenitiesData.find(a => a.id === amenityIdOrName);
                  const displayName = amenityData ? amenityData.name : amenityIdOrName.replace(/-/g, ' ');
                  const iconKey = amenityData ? amenityData.name.toLowerCase().replace(/\s+/g, '-') : amenityIdOrName;
                  const Icon = amenityIcons[iconKey] || amenityIcons[amenityIdOrName] || Shield;
                  
                  return (
                    <div key={amenityIdOrName} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium capitalize text-sm">{displayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Sreekanth" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sreekanth</h3>
                  <p className="text-sm text-muted-foreground capitalize">{property.ownerType}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="default" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <a href="tel:+916301575658">
                    <Phone className="h-4 w-4 mr-2" />
                    +91 63015 75658
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <a 
                    href={`https://wa.me/916301575658?text=${encodeURIComponent(`Hi, I'm interested in this property:\n\n${property.title}\n${property.location.area}, ${property.location.city}\nPrice: ${formatPrice(property.price, property.listingType)}\n\nPlease share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
