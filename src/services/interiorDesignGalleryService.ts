import {
  collection,
  getDocs,
  addDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const INTERIOR_GALLERY_COLLECTION = 'interiorDesignGalleryImages';

export interface InteriorDesignGalleryImage {
  imageUrl: string;
  alt?: string;
}

const defaultGallery: InteriorDesignGalleryImage[] = [
  { imageUrl: 'https://images.unsplash.com/photo-1615873968403-c6c33141022d?w=600&auto=format', alt: 'Modern living room' },
  { imageUrl: 'https://images.unsplash.com/photo-1616046229478-9941d80bfb3f?w=600&auto=format', alt: 'Contemporary interior' },
  { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadaa4a57af?w=600&auto=format', alt: 'Elegant bedroom' },
  { imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b46113c?w=600&auto=format', alt: 'Minimalist design' },
  { imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format', alt: 'Cozy space' },
  { imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format', alt: 'Modern apartment' },
];

/** Get all interior design gallery images from Firestore (one doc per image). */
export async function getInteriorDesignGallery(): Promise<InteriorDesignGalleryImage[]> {
  try {
    const snapshot = await getDocs(collection(db, INTERIOR_GALLERY_COLLECTION));
    if (snapshot.empty) return defaultGallery;
    const items = snapshot.docs
      .map((d) => ({ ...d.data(), _id: d.id } as { imageUrl: string; alt?: string; order: number; _id: string }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items.map(({ imageUrl, alt }) => ({ imageUrl, alt }));
  } catch (e) {
    console.error('getInteriorDesignGallery error', e);
  }
  return defaultGallery;
}

/** Replace all interior design gallery images in Firestore (each image as its own document). */
export async function setInteriorDesignGallery(items: InteriorDesignGalleryImage[]): Promise<void> {
  const col = collection(db, INTERIOR_GALLERY_COLLECTION);
  const snapshot = await getDocs(col);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  for (let i = 0; i < items.length; i++) {
    await addDoc(col, { imageUrl: items[i].imageUrl, alt: items[i].alt ?? null, order: i });
  }
}
