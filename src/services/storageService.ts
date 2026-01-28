import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// Upload a single image
export const uploadImage = async (
  file: File, 
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Upload property images
export const uploadPropertyImages = async (
  propertyId: string, 
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `${Date.now()}_${index}_${file.name}`;
    const path = `properties/${propertyId}/${fileName}`;
    return uploadImage(file, path);
  });
  
  return Promise.all(uploadPromises);
};

// Delete a single image
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Delete all images for a property
export const deletePropertyImages = async (propertyId: string): Promise<void> => {
  try {
    const folderRef = ref(storage, `properties/${propertyId}`);
    const listResult = await listAll(folderRef);
    
    const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting property images:", error);
  }
};

// Generate unique filename
export const generateFileName = (originalName: string): string => {
  const extension = originalName.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}_${random}.${extension}`;
};
