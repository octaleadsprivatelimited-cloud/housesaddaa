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
    // First try: Simple query without isActive filter to avoid index issues
    // Then filter in memory for isActive
    const constraints: QueryConstraint[] = [];
    
    // Apply filters that are indexed
    if (filters?.listingType) {
      constraints.push(where("listingType", "==", filters.listingType));
    }
    
    if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
      constraints.push(where("propertyType", "in", filters.propertyTypes));
    }
    
    if (filters?.location?.city) {
      constraints.push(where("location.city", "==", filters.location.city));
    }
    
    if (filters?.bedrooms && filters.bedrooms.length > 0) {
      constraints.push(where("bedrooms", "in", filters.bedrooms));
    }
    
    // Sorting - use simple orderBy to avoid composite index requirements
    constraints.push(orderBy("postedAt", "desc"));
    
    // Get more than needed to filter in memory
    constraints.push(limit(pageSize * 3));
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, PROPERTIES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    console.log('Firestore query returned:', snapshot.docs.length, 'documents');
    
    // Filter active properties in memory (more lenient - treat missing isActive as true for backwards compatibility)
    let properties = snapshot.docs
      .map(docToProperty)
      .filter(p => p.isActive !== false); // Show if isActive is true OR undefined
    
    // Apply client-side sorting
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
    
    // Fallback: Try simplest possible query if complex query fails
    if (error.message?.includes('index')) {
      console.log('Falling back to simple query...');
      try {
        const simpleQuery = query(
          collection(db, PROPERTIES_COLLECTION),
          orderBy("postedAt", "desc"),
          limit(pageSize)
        );
        const snapshot = await getDocs(simpleQuery);
        const properties = snapshot.docs
          .map(docToProperty)
          .filter(p => p.isActive !== false);
        
        return { properties, lastDoc: snapshot.docs[snapshot.docs.length - 1] || null };
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    }
    
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
