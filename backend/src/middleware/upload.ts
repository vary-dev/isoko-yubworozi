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

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  const isDocument = ['fileUrl', 'document', 'pdf'].includes(file.fieldname);
  const allowed = isDocument ? file.mimetype === 'application/pdf' : file.mimetype.startsWith('image/');
  if (!allowed) return callback(new Error(isDocument ? 'Only PDF documents are accepted' : 'Only image files are accepted'));
  callback(null, true);
};

export const uploadCombined = multer({ storage: combinedStorage, fileFilter, limits: { fileSize: 25 * 1024 * 1024, files: 2 } });

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

export const uploadImage = multer({ storage: imageStorage, fileFilter, limits: { fileSize: 8 * 1024 * 1024, files: 1 } });
