import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SITE_SETTINGS_COLLECTION = 'siteSettings';
const INTERIOR_GALLERY_DOC_ID = 'interiorDesignGallery';

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

export async function getInteriorDesignGallery(): Promise<InteriorDesignGalleryImage[]> {
  try {
    const ref = doc(db, SITE_SETTINGS_COLLECTION, INTERIOR_GALLERY_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items) && (snap.data()?.items as InteriorDesignGalleryImage[]).length > 0) {
      return snap.data().items as InteriorDesignGalleryImage[];
    }
  } catch (e) {
    console.error('getInteriorDesignGallery error', e);
  }
  return defaultGallery;
}

export async function setInteriorDesignGallery(items: InteriorDesignGalleryImage[]): Promise<void> {
  const ref = doc(db, SITE_SETTINGS_COLLECTION, INTERIOR_GALLERY_DOC_ID);
  await setDoc(ref, { items });
}
