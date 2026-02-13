// Property Types and Interfaces

export interface Property {
  id: string;
  title: string;
  slug: string;
  propertyType: PropertyType;
  listingType: 'sale' | 'rent';
  price: number;
  pricePerSqft?: number;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
  propertyStatus: 'ready' | 'under-construction';
  amenities: string[];
  images: string[];
  description: string;
  features?: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  ownerType: 'owner' | 'agent' | 'builder';
  mapLocation?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  postedAt: Date;
  updatedAt: Date;
  views: number;
  enquiries: number;
  metaTitle?: string;
  metaDescription?: string;
  /** PDF or document download URL (uploaded in admin) */
  brochureUrl?: string;
  /** YouTube video ID for property video (e.g. from watch?v=ID or youtu.be/ID) */
  youtubeVideoId?: string;
  /** Commercial: facing direction (e.g. North, East) */
  facings?: string;
  /** Floor plan image URLs (compressed on upload) */
  floorPlanUrls?: string[];
}

export type PropertyType = 
  | 'apartment' 
  | 'villa' 
  | 'plot' 
  | 'commercial' 
  | 'penthouse' 
  | 'studio' 
  | 'farmhouse'
  | 'independent-house'
  | 'builder-floor';

export interface PropertyLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  pincode?: string;
  fullAddress?: string;
}

export interface PropertyFilter {
  listingType?: 'sale' | 'rent';
  propertyTypes?: PropertyType[];
  location?: {
    city?: string;
    area?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  bedrooms?: number[];
  areaRange?: {
    min?: number;
    max?: number;
  };
  furnishing?: string[];
  propertyStatus?: string[];
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'popular';
}

export type EnquiryProjectType = 'residential' | 'commercial';

export interface Enquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  /** Additional contact number (do not replace primary) */
  alternatePhone?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  /** Contact form: Residential / Commercial */
  projectType?: EnquiryProjectType;
  /** Contact page: Buy / Sell / Take a Rent / Give For a Rental */
  intent?: string;
  propertyLocation?: string;
  budgetExpecting?: string;
  propertyType?: string;
  bhk?: string;
  pricingLooking?: string;
  /** Commercial only */
  companyName?: string;
  /** Commercial: project location */
  projectLocation?: string;
  /** Commercial: optional budget */
  estimatedBudget?: string;
}

export type PartnerType = 'bank' | 'company';

export interface Partner {
  id: string;
  type: PartnerType;
  title: string;
  imageUrl: string; // base64 data URL or public URL
  order?: number;
  createdAt: Date;
}

export interface GalleryVideo {
  id: string;
  title: string;
  videoId: string; // YouTube video ID for embed
  order?: number;
  createdAt: Date;
}

export interface LocationOption {
  id: string;
  country: string;
  state: string;
  city: string;
  areas: string[];
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
  createdAt: Date;
}
