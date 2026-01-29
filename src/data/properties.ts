import { Property, PropertyType, LocationOption, Amenity } from '@/types/property';

// Sample Properties Data
export const sampleProperties: Property[] = [
  {
    id: '1',
    title: '3 BHK Luxury Apartment in Jubilee Hills',
    slug: '3bhk-luxury-apartment-jubilee-hills-hyderabad',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 15000000,
    pricePerSqft: 8500,
    location: {
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      area: 'Jubilee Hills',
    },
    bedrooms: 3,
    bathrooms: 3,
    area: 1765,
    areaUnit: 'sqft',
    furnishing: 'semi-furnished',
    propertyStatus: 'ready',
    amenities: ['parking', 'lift', 'power-backup', 'gym', 'swimming-pool', 'security'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format',
    ],
    description: 'Luxurious 3 BHK apartment with modern amenities in the heart of Jubilee Hills. This property offers spacious rooms, premium fittings, and breathtaking city views.',
    features: ['Modular Kitchen', 'Italian Marble', 'Home Automation', 'Private Terrace'],
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 98765 43210',
    ownerType: 'agent',
    isActive: true,
    isFeatured: true,
    isVerified: true,
    postedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    views: 1250,
    enquiries: 45,
  },
  {
    id: '2',
    title: '2 BHK Modern Flat in Whitefield',
    slug: '2bhk-modern-flat-whitefield-bangalore',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 35000,
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Whitefield',
    },
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    areaUnit: 'sqft',
    furnishing: 'furnished',
    propertyStatus: 'ready',
    amenities: ['parking', 'lift', 'power-backup', 'gym', 'clubhouse'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format',
    ],
    description: 'Fully furnished 2 BHK flat in a premium gated community. Close to IT hubs and all essential amenities.',
    ownerName: 'Priya Sharma',
    ownerPhone: '+91 98765 43211',
    ownerType: 'owner',
    isActive: true,
    isFeatured: true,
    isVerified: true,
    postedAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    views: 890,
    enquiries: 32,
  },
  {
    id: '3',
    title: 'Stunning 4 BHK Villa in Gachibowli',
    slug: '4bhk-villa-gachibowli-hyderabad',
    propertyType: 'villa',
    listingType: 'sale',
    price: 45000000,
    pricePerSqft: 12000,
    location: {
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      area: 'Gachibowli',
    },
    bedrooms: 4,
    bathrooms: 5,
    area: 3750,
    areaUnit: 'sqft',
    furnishing: 'unfurnished',
    propertyStatus: 'ready',
    amenities: ['parking', 'garden', 'power-backup', 'swimming-pool', 'security', 'home-theatre'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format',
    ],
    description: 'Magnificent 4 BHK independent villa with private garden and swimming pool. Perfect for families seeking luxury living.',
    features: ['Private Pool', 'Home Theatre', 'Smart Home', 'Servant Quarters'],
    ownerName: 'Venkat Rao',
    ownerPhone: '+91 98765 43212',
    ownerType: 'builder',
    isActive: true,
    isFeatured: true,
    isVerified: true,
    postedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    views: 2100,
    enquiries: 78,
  },
  {
    id: '4',
    title: 'Commercial Office Space in Banjara Hills',
    slug: 'commercial-office-banjara-hills-hyderabad',
    propertyType: 'commercial',
    listingType: 'rent',
    price: 150000,
    location: {
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      area: 'Banjara Hills',
    },
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    areaUnit: 'sqft',
    furnishing: 'unfurnished',
    propertyStatus: 'ready',
    amenities: ['parking', 'lift', 'power-backup', 'security', 'cafeteria'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format',
    ],
    description: 'Premium commercial office space in prime Banjara Hills location. Ideal for corporate offices and startups.',
    ownerName: 'Commercial Properties Ltd',
    ownerPhone: '+91 98765 43213',
    ownerType: 'agent',
    isActive: true,
    isFeatured: false,
    isVerified: true,
    postedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    views: 650,
    enquiries: 23,
  },
  {
    id: '5',
    title: '1 BHK Studio Apartment in Koramangala',
    slug: '1bhk-studio-koramangala-bangalore',
    propertyType: 'studio',
    listingType: 'rent',
    price: 22000,
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Koramangala',
    },
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    areaUnit: 'sqft',
    furnishing: 'furnished',
    propertyStatus: 'ready',
    amenities: ['parking', 'lift', 'power-backup', 'security'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format',
      'https://images.unsplash.com/photo-1560185127-6a8eb3c93a76?w=800&auto=format',
    ],
    description: 'Cozy fully furnished studio apartment perfect for young professionals. Walking distance from metro and restaurants.',
    ownerName: 'Arun Verma',
    ownerPhone: '+91 98765 43214',
    ownerType: 'owner',
    isActive: true,
    isFeatured: false,
    isVerified: true,
    postedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    views: 420,
    enquiries: 18,
  },
  {
    id: '6',
    title: 'Premium Plot in Electronic City',
    slug: 'premium-plot-electronic-city-bangalore',
    propertyType: 'plot',
    listingType: 'sale',
    price: 8500000,
    pricePerSqft: 4250,
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Electronic City',
    },
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    areaUnit: 'sqft',
    furnishing: 'unfurnished',
    propertyStatus: 'ready',
    amenities: ['gated-community', 'water-supply', 'electricity'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&auto=format',
    ],
    description: 'BMRDA approved plot in gated community. All clearances available. Excellent investment opportunity.',
    ownerName: 'Green Lands Developers',
    ownerPhone: '+91 98765 43215',
    ownerType: 'builder',
    isActive: true,
    isFeatured: true,
    isVerified: true,
    postedAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    views: 1800,
    enquiries: 56,
  },
];

// Property Types with icons
export const propertyTypes: { value: PropertyType; label: string; icon: string }[] = [
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'independent-house', label: 'Independent House', icon: '🏠' },
  { value: 'plot', label: 'Plot/Land', icon: '📐' },
  { value: 'commercial', label: 'Commercial', icon: '🏪' },
  { value: 'penthouse', label: 'Penthouse', icon: '🌆' },
  { value: 'studio', label: 'Studio', icon: '🛏️' },
  { value: 'farmhouse', label: 'Farm House', icon: '🌾' },
  { value: 'builder-floor', label: 'Builder Floor', icon: '🏗️' },
];

// Helper function to get property type label
export const getPropertyTypeLabel = (propertyType: PropertyType): string => {
  const type = propertyTypes.find(t => t.value === propertyType);
  return type ? type.label : propertyType.replace('-', ' ');
};

// Default Hyderabad Location (primary service area)
export const locations: LocationOption[] = [
  {
    id: '1',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    areas: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'HITEC City', 'Madhapur', 'Kondapur', 'Kukatpally', 'Miyapur', 'Secunderabad', 'LB Nagar', 'Uppal', 'Manikonda', 'Nallagandla', 'Kokapet', 'Financial District'],
  },
];

// Amenities Data
export const amenities: Amenity[] = [
  { id: '1', name: 'Parking', icon: 'car', category: 'basic' },
  { id: '2', name: 'Lift', icon: 'arrow-up', category: 'basic' },
  { id: '3', name: 'Power Backup', icon: 'zap', category: 'basic' },
  { id: '4', name: 'Security', icon: 'shield', category: 'basic' },
  { id: '5', name: 'Gym', icon: 'dumbbell', category: 'lifestyle' },
  { id: '6', name: 'Swimming Pool', icon: 'waves', category: 'lifestyle' },
  { id: '7', name: 'Clubhouse', icon: 'home', category: 'lifestyle' },
  { id: '8', name: 'Garden', icon: 'flower', category: 'lifestyle' },
  { id: '9', name: 'Children Play Area', icon: 'baby', category: 'lifestyle' },
  { id: '10', name: 'Jogging Track', icon: 'footprints', category: 'lifestyle' },
  { id: '11', name: 'Tennis Court', icon: 'circle', category: 'sports' },
  { id: '12', name: 'Basketball Court', icon: 'circle', category: 'sports' },
  { id: '13', name: 'Indoor Games', icon: 'gamepad', category: 'sports' },
  { id: '14', name: 'Fire Safety', icon: 'flame', category: 'safety' },
  { id: '15', name: 'CCTV', icon: 'video', category: 'safety' },
  { id: '16', name: 'Intercom', icon: 'phone', category: 'safety' },
];

// Price ranges for filters
export const priceRanges = {
  sale: [
    { min: 0, max: 5000000, label: 'Under ₹50 Lakh' },
    { min: 5000000, max: 10000000, label: '₹50 Lakh - ₹1 Cr' },
    { min: 10000000, max: 20000000, label: '₹1 Cr - ₹2 Cr' },
    { min: 20000000, max: 50000000, label: '₹2 Cr - ₹5 Cr' },
    { min: 50000000, max: Infinity, label: 'Above ₹5 Cr' },
  ],
  rent: [
    { min: 0, max: 15000, label: 'Under ₹15,000' },
    { min: 15000, max: 30000, label: '₹15,000 - ₹30,000' },
    { min: 30000, max: 50000, label: '₹30,000 - ₹50,000' },
    { min: 50000, max: 100000, label: '₹50,000 - ₹1 Lakh' },
    { min: 100000, max: Infinity, label: 'Above ₹1 Lakh' },
  ],
};

// BHK options
export const bhkOptions = [1, 2, 3, 4, 5];

// Furnishing options
export const furnishingOptions = [
  { value: 'furnished', label: 'Fully Furnished' },
  { value: 'semi-furnished', label: 'Semi Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

// Property status options
export const propertyStatusOptions = [
  { value: 'ready', label: 'Ready to Move' },
  { value: 'under-construction', label: 'Under Construction' },
];

// Format price in Indian format
export const formatPrice = (price: number, listingType: 'sale' | 'rent' = 'sale'): string => {
  if (listingType === 'rent') {
    return `₹${price.toLocaleString('en-IN')}/month`;
  }
  
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

// Generate property slug
export const generateSlug = (title: string, city: string): string => {
  return `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
