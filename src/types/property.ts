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

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
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
