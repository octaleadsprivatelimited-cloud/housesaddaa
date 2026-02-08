import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SITE_SETTINGS_COLLECTION = 'siteSettings';
const MAIN_GALLERY_DOC_ID = 'mainGallery';

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

export async function getMainGalleryImages(): Promise<MainGalleryImage[]> {
  try {
    const ref = doc(db, SITE_SETTINGS_COLLECTION, MAIN_GALLERY_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items) && (snap.data()?.items as MainGalleryImage[]).length > 0) {
      return snap.data().items as MainGalleryImage[];
    }
  } catch (e) {
    console.error('getMainGalleryImages error', e);
  }
  return defaultGallery;
}

export async function setMainGalleryImages(items: MainGalleryImage[]): Promise<void> {
  const ref = doc(db, SITE_SETTINGS_COLLECTION, MAIN_GALLERY_DOC_ID);
  await setDoc(ref, { items });
}
