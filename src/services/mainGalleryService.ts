import { collection, getDocs, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MAIN_GALLERY_COLLECTION = 'mainGalleryImages';

export interface MainGalleryImage {
  imageUrl: string;
  alt?: string;
}

const defaultGallery: MainGalleryImage[] = [
  { imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Luxury apartment living room' },
  { imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Modern kitchen' },
  { imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', alt: 'Spacious bedroom' },
  { imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'Contemporary villa exterior' },
  { imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800', alt: 'Premium bathroom' },
  { imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', alt: 'Elegant dining area' },
  { imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', alt: 'Apartment balcony view' },
  { imageUrl: 'https://images.unsplash.com/photo-1600217979540-6b0c5d1e6f26?w=800', alt: 'Modern living space' },
  { imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', alt: 'House exterior' },
  { imageUrl: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', alt: 'Cozy interior' },
  { imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', alt: 'Luxury home interior' },
];

/** Get all main gallery images from Firestore (one doc per image, so no 1MB limit). */
export async function getMainGalleryImages(): Promise<MainGalleryImage[]> {
  try {
    const snapshot = await getDocs(collection(db, MAIN_GALLERY_COLLECTION));
    if (snapshot.empty) return defaultGallery;
    const items = snapshot.docs
      .map((d) => ({ ...d.data(), _id: d.id } as { imageUrl: string; alt?: string; order: number; _id: string }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items.map(({ imageUrl, alt }) => ({ imageUrl, alt }));
  } catch (e) {
    console.error('getMainGalleryImages error', e);
  }
  return defaultGallery;
}

/** Replace all main gallery images in Firestore (each image stored as its own document). */
export async function setMainGalleryImages(items: MainGalleryImage[]): Promise<void> {
  const col = collection(db, MAIN_GALLERY_COLLECTION);
  const snapshot = await getDocs(col);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  for (let i = 0; i < items.length; i++) {
    await addDoc(col, { imageUrl: items[i].imageUrl, alt: items[i].alt ?? null, order: i });
  }
}
