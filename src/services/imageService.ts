// Image service for converting images to base64 for Firestore storage
// WARNING: This approach has limitations - Firestore documents max 1MB

const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 600;
const JPEG_QUALITY = 0.7;

// Compress and convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Scale down if needed
        if (width > MAX_IMAGE_WIDTH) {
          height = (height * MAX_IMAGE_WIDTH) / width;
          width = MAX_IMAGE_WIDTH;
        }
        if (height > MAX_IMAGE_HEIGHT) {
          width = (width * MAX_IMAGE_HEIGHT) / height;
          height = MAX_IMAGE_HEIGHT;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 JPEG with compression
        const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Convert multiple images to base64
export const imagesToBase64 = async (files: File[]): Promise<string[]> => {
  const promises = files.map(file => imageToBase64(file));
  return Promise.all(promises);
};

// Validate image file
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid image type. Use JPEG, PNG, WebP or GIF.' };
  }
  
  // Max 5MB per image before compression
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image too large. Maximum 5MB per image.' };
  }
  
  return { valid: true };
};
