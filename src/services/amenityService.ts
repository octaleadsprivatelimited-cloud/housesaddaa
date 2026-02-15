import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Amenity } from "@/types/property";
import { amenities as staticAmenities } from "@/data/properties";

const AMENITIES_COLLECTION = "amenities";

export const getAmenities = async (): Promise<Amenity[]> => {
  try {
    const snapshot = await getDocs(collection(db, AMENITIES_COLLECTION));
    if (snapshot.empty) return staticAmenities;
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Amenity[];
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return staticAmenities;
  }
};

/** True if the amenities collection has at least one document (so we can edit/delete). */
export const hasAmenitiesInFirestore = async (): Promise<boolean> => {
  try {
    const snapshot = await getDocs(collection(db, AMENITIES_COLLECTION));
    return !snapshot.empty;
  } catch {
    return false;
  }
};

export const addAmenity = async (
  amenity: Omit<Amenity, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, AMENITIES_COLLECTION), {
    ...amenity,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateAmenity = async (
  id: string,
  updates: Partial<Omit<Amenity, "id">>
): Promise<void> => {
  const docRef = doc(db, AMENITIES_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAmenity = async (id: string): Promise<void> => {
  const docRef = doc(db, AMENITIES_COLLECTION, id);
  await deleteDoc(docRef);
};

/** Add all existing static amenities to Firestore, using their current ids (1–16) so existing properties keep matching. */
export const seedAmenities = async (): Promise<number> => {
  const now = Timestamp.now();
  for (const a of staticAmenities) {
    const docRef = doc(db, AMENITIES_COLLECTION, a.id);
    const snap = await getDoc(docRef);
    await setDoc(docRef, {
      name: a.name,
      icon: a.icon,
      category: a.category,
      ...(snap.exists() ? { updatedAt: now } : { createdAt: now }),
    }, { merge: true });
  }
  return staticAmenities.length;
};

export const getStaticAmenities = (): Amenity[] => staticAmenities;
