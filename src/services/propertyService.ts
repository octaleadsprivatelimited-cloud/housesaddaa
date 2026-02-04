import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property, PropertyFilter } from "@/types/property";

const PROPERTIES_COLLECTION = "properties";

// Convert Firestore document to Property
const docToProperty = (doc: DocumentSnapshot): Property => {
  const data = doc.data();
  if (!data) throw new Error("Document data is undefined");
  
  return {
    ...data,
    id: doc.id,
    postedAt: data.postedAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Property;
};

// Get all properties with optional filters
export const getProperties = async (
  filters?: PropertyFilter,
  pageSize: number = 12,
  lastDoc?: DocumentSnapshot
): Promise<{ properties: Property[]; lastDoc: DocumentSnapshot | null }> => {
  try {
    // Fetch all properties and filter in memory to avoid Firestore index requirements
    const constraints: QueryConstraint[] = [
      orderBy("postedAt", "desc"),
      limit(100) // Get enough to filter
    ];
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, PROPERTIES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    console.log('Firestore query returned:', snapshot.docs.length, 'documents');
    
    // Convert to Property objects
    let properties = snapshot.docs.map(docToProperty);
    
    // Apply all filters in memory for reliability
    properties = properties.filter(p => {
      // Must be active (or undefined for backwards compatibility)
      if (p.isActive === false) return false;
      
      // Listing type filter
      if (filters?.listingType && p.listingType !== filters.listingType) {
        return false;
      }
      
      // Property type filter
      if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(p.propertyType)) {
          return false;
        }
      }
      
      // Area filter
      if (filters?.location?.area && p.location.area !== filters.location.area) {
        return false;
      }
      
      // City filter (fallback)
      if (filters?.location?.city && p.location.city !== filters.location.city) {
        return false;
      }
      
      // Price range filter
      if (filters?.priceRange) {
        if (filters.priceRange.min != null && p.price < filters.priceRange.min) return false;
        if (filters.priceRange.max != null && p.price > filters.priceRange.max) return false;
      }

      // Bedrooms filter
      if (filters?.bedrooms && filters.bedrooms.length > 0) {
        if (!filters.bedrooms.includes(p.bedrooms)) {
          return false;
        }
      }
      
      // Furnishing filter
      if (filters?.furnishing && filters.furnishing.length > 0) {
        if (!filters.furnishing.includes(p.furnishing)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    switch (filters?.sortBy) {
      case 'price-low':
        properties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        properties.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        properties.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      // 'newest' is default from orderBy
    }
    
    // Limit to requested page size
    properties = properties.slice(0, pageSize);
    
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    
    return { properties, lastDoc: newLastDoc };
  } catch (error: any) {
    console.error('Firestore query error:', error.message);
    return { properties: [], lastDoc: null };
  }
};

// Get single property by slug
export const getPropertyBySlug = async (slug: string): Promise<Property | null> => {
  const q = query(
    collection(db, PROPERTIES_COLLECTION),
    where("slug", "==", slug),
    limit(1)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  return docToProperty(snapshot.docs[0]);
};

// Get single property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return docToProperty(snapshot);
};

// Get featured properties
export const getFeaturedProperties = async (count: number = 6): Promise<Property[]> => {
  try {
    // Simple query to avoid index requirements, then filter in memory
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      orderBy("postedAt", "desc"),
      limit(count * 3) // Get more to filter
    );
    const snapshot = await getDocs(q);
    
    // Filter for active and featured in memory
    const properties = snapshot.docs
      .map(docToProperty)
      .filter(p => p.isActive !== false && p.isFeatured === true)
      .slice(0, count);
    
    return properties;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

// Get properties by type
export const getPropertiesByType = async (propertyType: string, count: number = 4): Promise<Property[]> => {
  try {
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      orderBy("postedAt", "desc"),
      limit(count * 3)
    );
    const snapshot = await getDocs(q);
    
    const properties = snapshot.docs
      .map(docToProperty)
      .filter(p => p.isActive !== false && p.propertyType === propertyType)
      .slice(0, count);
    
    return properties;
  } catch (error) {
    console.error(`Error fetching ${propertyType} properties:`, error);
    return [];
  }
};

// Admin: Get all properties (including inactive)
export const getAllPropertiesAdmin = async (): Promise<Property[]> => {
  const q = query(
    collection(db, PROPERTIES_COLLECTION),
    orderBy("postedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToProperty);
};

// Admin: Fix all properties to have isActive field (one-time migration)
export const migratePropertiesToActive = async (): Promise<number> => {
  const snapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
  let updated = 0;
  
  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    // Only update if isActive is not already set to true
    if (data.isActive !== true) {
      await updateDoc(doc(db, PROPERTIES_COLLECTION, docSnapshot.id), {
        isActive: true,
        updatedAt: Timestamp.now()
      });
      updated++;
    }
  }
  
  return updated;
};

// Admin: Add new property
export const addProperty = async (property: Omit<Property, 'id' | 'postedAt' | 'updatedAt' | 'views' | 'enquiries'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
    ...property,
    postedAt: now,
    updatedAt: now,
    views: 0,
    enquiries: 0
  });
  return docRef.id;
};

// Admin: Update property
export const updateProperty = async (id: string, updates: Partial<Property>): Promise<void> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

// Admin: Delete property
export const deleteProperty = async (id: string): Promise<void> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(docRef);
};

// Admin: Toggle property status
export const togglePropertyStatus = async (id: string, isActive: boolean): Promise<void> => {
  await updateProperty(id, { isActive });
};

// Increment view count
export const incrementPropertyViews = async (id: string): Promise<void> => {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const currentViews = snapshot.data().views || 0;
    await updateDoc(docRef, { views: currentViews + 1 });
  }
};

// Search properties by keyword
export const searchProperties = async (keyword: string): Promise<Property[]> => {
  // Note: Firestore doesn't support full-text search natively
  // For production, consider Algolia or Elasticsearch
  // This is a basic implementation searching by title
  const q = query(
    collection(db, PROPERTIES_COLLECTION),
    where("isActive", "==", true),
    orderBy("title"),
    limit(20)
  );
  const snapshot = await getDocs(q);
  
  const searchLower = keyword.toLowerCase();
  return snapshot.docs
    .map(docToProperty)
    .filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.location.city.toLowerCase().includes(searchLower) ||
      p.location.area.toLowerCase().includes(searchLower)
    );
};
