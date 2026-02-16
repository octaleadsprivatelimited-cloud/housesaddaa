import { collection, getDocs, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PROPERTY_GALLERY_COLLECTION = 'propertyGalleryImages';

export interface PropertyGalleryImage {
  imageUrl: string;
  alt?: string;
}

/** Get all property gallery images from Firestore (one doc per image). */
export async function getPropertyGalleryImages(): Promise<PropertyGalleryImage[]> {
  try {
    const snapshot = await getDocs(collection(db, PROPERTY_GALLERY_COLLECTION));
    if (snapshot.empty) return [];
    const items = snapshot.docs
      .map((d) => ({ ...d.data(), _id: d.id } as { imageUrl: string; alt?: string; order: number; _id: string }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items.map(({ imageUrl, alt }) => ({ imageUrl, alt }));
  } catch (e) {
    console.error('getPropertyGalleryImages error', e);
    return [];
  }
}

/** Replace all property gallery images in Firestore (each image as its own document). */
export async function setPropertyGalleryImages(items: PropertyGalleryImage[]): Promise<void> {
  const col = collection(db, PROPERTY_GALLERY_COLLECTION);
  const snapshot = await getDocs(col);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  for (let i = 0; i < items.length; i++) {
    await addDoc(col, { imageUrl: items[i].imageUrl, alt: items[i].alt ?? null, order: i });
  }
}
