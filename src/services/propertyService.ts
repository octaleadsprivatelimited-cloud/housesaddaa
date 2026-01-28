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
  const constraints: QueryConstraint[] = [];
  
  // Apply filters
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
  
  if (filters?.furnishing && filters.furnishing.length > 0) {
    constraints.push(where("furnishing", "in", filters.furnishing));
  }
  
  // Always filter active properties for public
  constraints.push(where("isActive", "==", true));
  
  // Sorting
  switch (filters?.sortBy) {
    case 'price-low':
      constraints.push(orderBy("price", "asc"));
      break;
    case 'price-high':
      constraints.push(orderBy("price", "desc"));
      break;
    case 'popular':
      constraints.push(orderBy("views", "desc"));
      break;
    case 'newest':
    default:
      constraints.push(orderBy("postedAt", "desc"));
  }
  
  // Pagination
  constraints.push(limit(pageSize));
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  
  try {
    const q = query(collection(db, PROPERTIES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    console.log('Firestore query returned:', snapshot.docs.length, 'properties');
    
    const properties = snapshot.docs.map(docToProperty);
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    
    return { properties, lastDoc: newLastDoc };
  } catch (error: any) {
    console.error('Firestore query error:', error.message);
    // If index error, the error message contains a link to create the index
    if (error.message?.includes('index')) {
      console.error('INDEX REQUIRED - Check Firebase Console or click the link in the error above');
    }
    throw error;
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
  const q = query(
    collection(db, PROPERTIES_COLLECTION),
    where("isActive", "==", true),
    where("isFeatured", "==", true),
    orderBy("postedAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToProperty);
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
