import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { validateImage } from '@/services/imageService';

const FLOOR_PLANS_PATH = 'propertyFloorPlans';
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const JPEG_QUALITY = 0.8;
const MAX_FILES = 10;

export function validateFloorPlanFile(file: File): ReturnType<typeof validateImage> {
  return validateImage(file);
}

/**
 * Compress an image file to JPEG for floor plans. Returns a Blob.
 */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
          'image/jpeg',
          JPEG_QUALITY
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a single floor plan image (compressed) and return its URL.
 */
export async function uploadFloorPlanImage(propertyId: string, file: File, index: number): Promise<string> {
  const validation = validateFloorPlanFile(file);
  if (!validation.valid) throw new Error(validation.error);
  const compressed = await compressImage(file);
  const path = `${FLOOR_PLANS_PATH}/${propertyId}/${Date.now()}_${index}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

/**
 * Upload multiple floor plan images (each compressed automatically). Returns array of URLs.
 */
export async function uploadFloorPlans(propertyId: string, files: File[]): Promise<string[]> {
  if (files.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} floor plan images allowed.`);
  }
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadFloorPlanImage(propertyId, files[i], i);
    urls.push(url);
  }
  return urls;
}
