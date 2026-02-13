import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PDFDocument } from 'pdf-lib';
import { storage } from '@/lib/firebase';

const BROCHURES_PATH = 'propertyBrochures';

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE_MB = 10;

export function validateBrochureFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a PDF or Word document.' };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File must be under ${MAX_SIZE_MB}MB.` };
  }
  return { valid: true };
}

/**
 * Compress a PDF by re-saving with object streams. Returns a Blob if smaller; otherwise the original file.
 * Non-PDF or on error returns the original file.
 */
async function compressPdfIfPossible(file: File): Promise<File | Blob> {
  if (file.type !== 'application/pdf') return file;
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const compressed = await doc.save({ useObjectStreams: true });
    const compressedSize = compressed.byteLength;
    if (compressedSize < file.size) {
      return new Blob([compressed], { type: 'application/pdf' });
    }
  } catch {
    // Invalid PDF or compression failed – use original
  }
  return file;
}

/**
 * Upload a brochure file for a property. PDFs are compressed automatically before upload.
 * Returns the public download URL. Re-uploading overwrites the previous file for that property.
 */
export async function uploadBrochure(propertyId: string, file: File): Promise<string> {
  const validation = validateBrochureFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  const ext = file.name.split('.').pop() || 'pdf';
  const path = `${BROCHURES_PATH}/${propertyId}.${ext}`;
  const storageRef = ref(storage, path);

  const toUpload = await compressPdfIfPossible(file);
  const payload = toUpload instanceof File ? toUpload : new File([toUpload], file.name, { type: 'application/pdf' });
  await uploadBytes(storageRef, payload, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  return url;
}
