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

const LOCATIONS_COLLECTION = "locations";

// Get all locations
export const getLocations = async (): Promise<LocationOption[]> => {
  try {
    const q = query(
      collection(db, LOCATIONS_COLLECTION),
      orderBy("city", "asc")
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LocationOption[];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

// Seed static locations to Firestore
export const seedLocations = async (): Promise<number> => {
  let count = 0;
  for (const location of staticLocations) {
    await addDoc(collection(db, LOCATIONS_COLLECTION), {
      country: location.country,
      state: location.state,
      city: location.city,
      areas: location.areas,
      createdAt: Timestamp.now()
    });
    count++;
  }
  return count;
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
