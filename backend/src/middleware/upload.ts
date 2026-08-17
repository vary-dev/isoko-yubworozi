import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Combined storage: routes files based on field name
// - coverImage / image fields → image storage (WebP conversion)
// - fileUrl / document fields → raw storage (PDFs, etc.)
const combinedStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (_req: any, file: any) => {
    const isDocumentField = ['fileUrl', 'document', 'pdf'].includes(file.fieldname);

    if (isDocumentField) {
      // PDF / document storage: raw resource type
      return {
        folder: 'isoko/documents',
        resource_type: 'raw',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      };
    }

    // Image storage: convert to WebP
    return {
      folder: 'isoko/images',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      format: 'webp',
      transformation: [{ width: 1200, crop: 'limit' }],
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    };
  },
});

export const uploadCombined = multer({ storage: combinedStorage });

// Keep the original single-purpose exports for backward compatibility
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'isoko/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    format: 'webp',
    transformation: [{ width: 1200, crop: 'limit' }],
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  } as any,
});

export const uploadImage = multer({ storage: imageStorage });
