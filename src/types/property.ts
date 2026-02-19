// Property Types and Interfaces

/** Project type for large real-estate projects (99+ acres). When absent or 'individual', treated as single property. */
export type ProjectType =
  | 'individual'
  | 'gated-community'
  | 'apartment-project'
  | 'villa-project'
  | 'commercial-project'
  | 'mixed-use-project';

/** Land area unit for project size (supports 99+ acres). */
export type LandAreaUnit = 'acres' | 'sqyards' | 'sqft';

/** Project status for listing. */
export type ProjectStatusType = 'pre-launch' | 'under-construction' | 'ready-to-move' | 'new-launch';

/** BHK type for unit configuration. */
export type UnitBhkType = '1' | '2' | '2.5' | '3' | '4' | 'Villa' | 'Plot';

/** Project size and land details (scalable for large projects). */
export interface ProjectDetails {
  totalLandArea: number;
  landAreaUnit: LandAreaUnit;
  numberOfPhases?: number;
  numberOfBlocksOrTowers: number;
  totalUnits: number;
}

/** Single unit configuration (BHK, size, price range, count). */
export interface UnitConfiguration {
  bhkType: UnitBhkType;
  unitSizeSqft: number;
  priceMin: number;
  priceMax: number;
  numberOfUnits: number;
}

/** Plot/Villa size option (for plot/villa projects). */
export interface PlotVillaOption {
  sizeSqYards: number;
  facing: string;
  cornerPlot: boolean;
}

/** Legal and approval details. */
export interface LegalApproval {
  reraNumber?: string;
  approvalAuthority?: string;
  approvalDocUrls?: string[];
}

/** Single size option (BHK, bathrooms, area) for individual properties with multiple configurations. */
export interface SizeOption {
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
}

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
  /** Additional YouTube videos shown in this property's gallery (title + videoId). */
  galleryVideos?: { title: string; videoId: string }[];
  /** Facing direction(s). Single string for backward compatibility (e.g. "North" or "North, East"). */
  facings?: string;
  /** Multiple facing options (e.g. ["North", "East"]). When set, facings is also set to joined string for display. */
  facingsList?: string[];
  /** Floor plan image URLs (compressed on upload) */
  floorPlanUrls?: string[];

  /** Year construction started (e.g. 2022). */
  yearOfConstruction?: number;
  /** Year construction/completion completed (e.g. 2024). */
  yearOfCompletion?: number;

  /** Multiple BHK/bathrooms/area options for individual listings (e.g. 2 BHK / 1200 sqft, 3 BHK / 1500 sqft). When set, first option also populates bedrooms, bathrooms, area. */
  sizeOptions?: SizeOption[];

  // ----- Large project fields (optional; no breaking change for existing properties) -----
  /** When set, property is a project listing (gated community, apartment project, etc.). */
  projectType?: ProjectType;
  /** Land and scale details (phases, blocks, total units). */
  projectDetails?: ProjectDetails;
  /** Unit configurations (BHK, size, price range, count). */
  unitConfigurations?: UnitConfiguration[];
  /** Plot/villa size options (sizes, facing, corner). */
  plotVillaOptions?: PlotVillaOption[];
  /** Project status: pre-launch, under construction, etc. */
  projectStatus?: ProjectStatusType;
  /** Possession date (ISO string). */
  possessionDate?: string;
  /** Legal & approval (RERA, authority, doc URLs). */
  legalApproval?: LegalApproval;
  /** Master plan image (base64 or URL). */
  masterPlanImageUrl?: string;
  /** Custom amenity names (in addition to amenity IDs). */
  customAmenities?: string[];
  /** SEO keywords (comma-separated or array). */
  metaKeywords?: string;
  /** Social sharing image URL. */
  socialSharingImageUrl?: string;
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
  /** Service-specific: Home Loans – preferred bank name */
  preferredBank?: string;
  /** Service-specific: Property Promotions – property details */
  propertyDetails?: string;
  /** Service-specific: Interior Design – project/space details */
  interiorProjectDetails?: string;
  /** Source page: 'home-loans' | 'interior-design' | 'property-promotions' | 'contact-form' | 'contact' */
  enquirySource?: string;
  /** When property type is "Other", user can specify (contact page) */
  propertyTypeOther?: string;
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
