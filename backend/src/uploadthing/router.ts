/**
 * Saturn 3D - UploadThing Type-Safe File Router
 * Defines permission middleware, size limits, and post-upload metadata tracking
 */

export interface UploadFileResult {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export const UPLOADTHING_CONFIG = {
  appId: process.env.UPLOADTHING_APP_ID || 'saturn3d-app',
  apiKey: process.env.UPLOADTHING_SECRET || 'ut_secret_placeholder',
  maxImageSize: '8MB',
  maxCadSize: '64MB',
  allowedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedCadExtensions: ['.stl', '.step', '.stp', '.obj', '.3mf'],
};

/**
 * Validates uploaded files against security constraints
 */
export function validateUploadFile(
  file: { originalname: string; size: number; mimetype: string },
  type: 'image' | 'cad'
): { valid: boolean; error?: string } {
  if (type === 'image') {
    if (!UPLOADTHING_CONFIG.allowedImageMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are permitted' };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { valid: false, error: 'Image exceeds 8MB maximum upload limit' };
    }
  } else if (type === 'cad') {
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (!UPLOADTHING_CONFIG.allowedCadExtensions.includes(ext)) {
      return { valid: false, error: 'Only .STL, .STEP, .STP, .OBJ, and .3MF CAD files are permitted' };
    }
    if (file.size > 64 * 1024 * 1024) {
      return { valid: false, error: 'CAD file exceeds 64MB maximum upload limit' };
    }
  }

  return { valid: true };
}
