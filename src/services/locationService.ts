import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  orderBy,
  query
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LocationOption } from "@/types/property";
import { locations as staticLocations } from "@/data/properties";

// Default Hyderabad location
const defaultHyderabadLocation = {
  id: 'default-hyderabad',
  country: 'India',
  state: 'Telangana',
  city: 'Hyderabad',
  areas: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'HITEC City', 'Madhapur', 'Kondapur', 'Kukatpally', 'Miyapur', 'Secunderabad', 'LB Nagar', 'Uppal', 'Manikonda', 'Nallagandla', 'Kokapet', 'Financial District'],
};

const LOCATIONS_COLLECTION = "locations";

// Get all locations
export const getLocations = async (): Promise<LocationOption[]> => {
  try {
    // Simple query without orderBy to avoid index requirements
    const snapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
    
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LocationOption[];
    
    // Sort in memory
    return locations.sort((a, b) => a.city.localeCompare(b.city));
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

// Get static locations (fallback - Hyderabad only)
export const getStaticLocations = (): LocationOption[] => {
  return staticLocations.length > 0 ? staticLocations : [defaultHyderabadLocation];
};

// Get default Hyderabad location
export const getDefaultLocation = (): LocationOption => {
  return defaultHyderabadLocation;
};

// Seed default Hyderabad location to Firestore
export const seedLocations = async (): Promise<number> => {
  // Seed only Hyderabad by default
  await addDoc(collection(db, LOCATIONS_COLLECTION), {
    country: defaultHyderabadLocation.country,
    state: defaultHyderabadLocation.state,
    city: defaultHyderabadLocation.city,
    areas: defaultHyderabadLocation.areas,
    createdAt: Timestamp.now()
  });
  return 1;
};

// Add new location
export const addLocation = async (location: Omit<LocationOption, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, LOCATIONS_COLLECTION), {
    ...location,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

// Update location (add/remove areas)
export const updateLocation = async (id: string, updates: Partial<LocationOption>): Promise<void> => {
  const docRef = doc(db, LOCATIONS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

// Delete location
export const deleteLocation = async (id: string): Promise<void> => {
  const docRef = doc(db, LOCATIONS_COLLECTION, id);
  await deleteDoc(docRef);
};

// Add area to existing location
export const addAreaToLocation = async (locationId: string, area: string, currentAreas: string[]): Promise<void> => {
  if (currentAreas.includes(area)) {
    throw new Error('Area already exists');
  }
  await updateLocation(locationId, {
    areas: [...currentAreas, area]
  });
};

// Remove area from location
export const removeAreaFromLocation = async (locationId: string, area: string, currentAreas: string[]): Promise<void> => {
  await updateLocation(locationId, {
    areas: currentAreas.filter(a => a !== area)
  });
};
