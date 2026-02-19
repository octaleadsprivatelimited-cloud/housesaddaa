import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, Phone, 
  BadgeCheck, Calendar, Eye, MessageSquare, ArrowLeft,
  Car, Dumbbell, Waves, Shield, Zap, Building2, Loader2, MessageCircle,
  Download, Youtube, Copy, Compass, LayoutGrid, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatPrice } from '@/data/properties';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { useAmenities } from '@/hooks/useAmenities';
import { PropertyCardCarousel } from '@/components/property/PropertyCardCarousel';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property';
import { getPropertyBySlug, getPropertiesByType } from '@/services/propertyService';
import SEO from '@/components/SEO';
import { toast } from '@/components/ui/sonner';

const WISHLIST_KEY = 'housesadda_wishlist';

function getWishlistSlugs(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setWishlistSlugs(slugs: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(slugs));
}

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
  const { getPropertyTypeLabel } = usePropertyTypes();
  const { amenities: amenitiesData } = useAmenities();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

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

  useEffect(() => {
    if (property?.slug) {
      setIsInWishlist(getWishlistSlugs().includes(property.slug));
    }
  }, [property?.slug]);

  const toggleWishlist = () => {
    if (!property?.slug) return;
    const slugs = getWishlistSlugs();
    const next = slugs.includes(property.slug)
      ? slugs.filter((s) => s !== property.slug)
      : [...slugs, property.slug];
    setWishlistSlugs(next);
    setIsInWishlist(next.includes(property.slug));
    toast.success(next.includes(property.slug) ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const shareUrl = property ? `${window.location.origin}/property/${property.slug}` : '';
  const shareText = property
    ? `${property.title} in ${property.location.area}, ${property.location.city}. ${property.listingType === 'sale' ? 'Sale' : 'Rent'} - ${formatPrice(property.price, property.listingType)}`
    : '';

  const shareLinks = property
    ? {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      }
    : null;

  function copyShareUrl(url: string) {
    navigator.clipboard.writeText(url).then(
      () => toast.success('Link copied to clipboard'),
      () => toast.error('Could not copy link')
    );
  }

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
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className={cn(
                      'w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors',
                      isInWishlist && 'text-[#E10600]'
                    )}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current')} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                        aria-label="Share property"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <a href={shareLinks?.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-[#25D366]" />
                          WhatsApp
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={shareLinks?.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <span className="text-[#1877F2] font-bold text-sm">f</span>
                          Facebook
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={shareLinks?.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          X (Twitter)
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={shareLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          LinkedIn
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyShareUrl(shareUrl)} className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Copy link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Square className="h-4 w-4 shrink-0" />
                      ₹{property.pricePerSqft.toLocaleString()} per sqft
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="py-4 border-y border-border space-y-4">
                {/* Multiple BHK/bath/area options */}
                {property.sizeOptions && property.sizeOptions.length > 0 ? (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Available configurations</div>
                    <div className="flex flex-wrap gap-2">
                      {property.sizeOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border text-sm"
                        >
                          {opt.bedrooms > 0 && (
                            <span className="font-medium">{opt.bedrooms} BHK</span>
                          )}
                          {opt.bathrooms > 0 && (
                            <>
                              {opt.bedrooms > 0 && <span className="text-muted-foreground">•</span>}
                              <span>{opt.bathrooms} Bath</span>
                            </>
                          )}
                          {opt.areaSqft > 0 && (
                            <>
                              {(opt.bedrooms > 0 || opt.bathrooms > 0) && <span className="text-muted-foreground">•</span>}
                              <span>{opt.areaSqft.toLocaleString()} sqft</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {property.propertyType !== 'commercial' && (
                      <>
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
                      </>
                    )}
                    <div className="text-center">
                      <Square className="h-6 w-6 mx-auto text-primary mb-1" />
                      <div className="font-semibold">{property.area > 0 ? property.area.toLocaleString() : '–'}</div>
                      <div className="text-sm text-muted-foreground">{property.areaUnit}</div>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto text-primary mb-1" />
                      <div className="font-semibold">{getPropertyTypeLabel(property.propertyType)}</div>
                      <div className="text-sm text-muted-foreground">Type</div>
                    </div>
                  </div>
                )}

                {/* Facings (single or multiple) */}
                {(property.facingsList?.length ? property.facingsList.length > 0 : property.facings) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Compass className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">Facing:</span>
                    <div className="font-medium">
                      {property.facingsList && property.facingsList.length > 0
                        ? property.facingsList.join(', ')
                        : property.facings}
                    </div>
                  </div>
                )}

                {/* Type when sizeOptions shown (so type is still visible) */}
                {property.sizeOptions && property.sizeOptions.length > 0 && (
                  <div className="text-center sm:text-left">
                    <Building2 className="h-5 w-5 inline text-primary mr-1.5" />
                    <span className="text-sm text-muted-foreground">Type: </span>
                    <span className="font-medium">{getPropertyTypeLabel(property.propertyType)}</span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
                <div>
                  <span className="text-muted-foreground text-sm">Furnishing</span>
                  <div className="font-medium capitalize">{property.furnishing.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Status</span>
                  <div className="font-medium capitalize">{property.propertyStatus.replace('-', ' ')}</div>
                </div>
                {property.yearOfConstruction != null && property.yearOfConstruction > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">Year of Construction</span>
                    <div className="font-medium">{property.yearOfConstruction}</div>
                  </div>
                )}
                {property.yearOfCompletion != null && property.yearOfCompletion > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">Year of Completion</span>
                    <div className="font-medium">{property.yearOfCompletion}</div>
                  </div>
                )}
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
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</div>
              
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

            {/* Floor Plans */}
            {property.floorPlanUrls && property.floorPlanUrls.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5" /> Floor Plans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.floorPlanUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
                    >
                      <img src={url} alt={`Floor plan ${i + 1}`} className="w-full h-48 object-contain bg-muted/30" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Brochure download */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Brochure
              </h2>
              {property.brochureUrl ? (
                <a
                  href={property.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download Brochure
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">No brochure available for this property.</p>
              )}
            </div>

            {/* YouTube video */}
            {property.youtubeVideoId && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-[#FF0000]" />
                  Property Video
                </h2>
                <div className="aspect-video w-full max-w-2xl rounded-xl overflow-hidden bg-muted">
                  <iframe
                    title="Property video"
                    src={`https://www.youtube.com/embed/${property.youtubeVideoId}`}
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Gallery videos (per-property) */}
            {property.galleryVideos && property.galleryVideos.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-[#FF0000]" />
                  Gallery Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.galleryVideos.map((v, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-muted">
                      <div className="aspect-video relative">
                        <iframe
                          title={v.title}
                          src={`https://www.youtube.com/embed/${v.videoId}`}
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm">{v.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#E5E5E5] flex items-center justify-center p-2 shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Houses Adda" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg">{property.ownerName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{property.ownerType}</p>
                </div>
              </div>

              <div className="space-y-3">
                {property.brochureUrl ? (
                  <a
                    href={property.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-primary bg-primary/5 text-primary font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Download Brochure
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm">
                    <FileText className="h-4 w-4" />
                    No brochure
                  </div>
                )}
                <Button 
                  variant="default" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <a href={`tel:${property.ownerPhone.replace(/\s/g, '')}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {property.ownerPhone}
                  </a>
                </Button>
                <a 
                  href={`https://wa.me/${property.ownerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in this property:\n\n${property.title}\n${property.location.area}, ${property.location.city}\nPrice: ${formatPrice(property.price, property.listingType)}\n\nPlease share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>

                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Share this property</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={shareLinks?.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center text-[#25D366]"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                    <a
                      href={shareLinks?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2] font-bold text-sm"
                      aria-label="Share on Facebook"
                    >
                      f
                    </a>
                    <a
                      href={shareLinks?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
                      aria-label="Share on X (Twitter)"
                    >
                      <Share2 className="h-4 w-4" />
                    </a>
                    <a
                      href={shareLinks?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2]"
                      aria-label="Share on LinkedIn"
                    >
                      <Share2 className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyShareUrl(shareUrl)}
                      className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
                      aria-label="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading mb-8">Similar Properties</h2>
            <PropertyCardCarousel properties={similarProperties} variant="default" />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
