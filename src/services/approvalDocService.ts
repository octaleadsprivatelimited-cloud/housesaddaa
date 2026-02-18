import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const APPROVAL_DOCS_PATH = 'propertyApprovals';
const ALLOWED_TYPES = ['application/pdf'];
const MAX_SIZE_MB = 10;

export function validateApprovalDoc(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a PDF file.' };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File must be under ${MAX_SIZE_MB}MB.` };
  }
  return { valid: true };
}

/**
 * Upload an approval document (PDF) for a property. Returns the public URL.
 * Use multiple calls for multiple documents; store URLs in property.legalApproval.approvalDocUrls.
 */
export async function uploadApprovalDoc(propertyId: string, file: File, index: number): Promise<string> {
  const validation = validateApprovalDoc(file);
  if (!validation.valid) throw new Error(validation.error);
  const path = `${APPROVAL_DOCS_PATH}/${propertyId}/${Date.now()}_${index}.pdf`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
  return getDownloadURL(storageRef);
}

/**
 * Upload multiple approval documents. Returns array of URLs in order.
 */
export async function uploadApprovalDocs(propertyId: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadApprovalDoc(propertyId, files[i], i);
    urls.push(url);
  }
  return urls;
}
