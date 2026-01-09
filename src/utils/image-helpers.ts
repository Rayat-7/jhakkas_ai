/**
 * Image Helper Utilities for Jhakkas AI
 * Handles image processing, resizing, and Base64 conversion
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Converts a File object to a Base64 string with optional resizing
 * @param file - The image file to process
 * @param options - Processing options (maxWidth, maxHeight, quality)
 * @returns Promise resolving to Base64 string
 */
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const JPEG_QUALITY = 0.8;

/**
 * Converts a File object to a Base64 string with optional resizing
 * @param file - The image file to process
 * @param options - Processing options (maxWidth, maxHeight, quality)
 * @returns Promise resolving to Base64 string
 */
export async function convertImageToBase64(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<string> {
  // Handle HEIC/HEIF files: Skip client-side conversion as it's unstable
  // Gemini API supports HEIC directly, so we just pass the raw base64 with explicit mime type
  if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
     console.log("Detected HEIC file, passing raw base64 to API with explicit MIME...");
     return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Read as ArrayBuffer to ensure we get raw bytes, then convert to base64 manually
          // This allows us to cleanly prepend the correct data URI scheme
          const arrayBuffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = window.btoa(binary);
          resolve(`data:image/heic;base64,${base64}`);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
     });
  }

  return processImage(file);
}

const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        const base64String = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(base64String);
      };
      img.onerror = (error) => reject(error);
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a file is a supported image format with robust checks
 * @param file - File to validate
 * @returns boolean indicating if file is valid
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/webp", 
    "image/heic", 
    "image/heif"
  ];
  
  // Check MIME type
  if (validTypes.includes(file.type)) return true;
  
  // Fallback: Check extension because Windows/Browsers often get HEIC MIME type wrong
  const fileName = file.name.toLowerCase();
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
  
  return validExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Formats file size to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
