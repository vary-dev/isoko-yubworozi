import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Image Storage: Converts everything to WebP
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'isoko/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    format: 'webp', // <--- This forces conversion to WebP
    transformation: [{ width: 1200, crop: 'limit' }], // Optional: Resizes large images to max 1200px width
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  } as any,
});

// PDF Storage: Stays as raw documents
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'isoko/documents',
    resource_type: 'raw', // Required for PDFs
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  } as any,
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadPDF = multer({ storage: pdfStorage });