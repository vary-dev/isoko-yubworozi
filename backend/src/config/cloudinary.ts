import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

// The public brand assets use the Cloudinary account "dydg39ukk".
// Older deployment configuration may contain the truncated value "dydg39",
// which Cloudinary rejects with "Invalid cloud_name".
const configuredCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudName =
  configuredCloudName === 'dydg39' ? 'dydg39ukk' : configuredCloudName;

if (configuredCloudName === 'dydg39') {
  console.warn(
    '[Cloudinary] CLOUDINARY_CLOUD_NAME was "dydg39" (truncated); using "dydg39ukk". ' +
      'Update the backend deployment environment variable to "dydg39ukk".',
  );
}

const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    '[Cloudinary] Missing required backend configuration. Set CLOUDINARY_CLOUD_NAME, ' +
      'CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET. CLOUDINARY_UPLOAD_PRESET alone ' +
      'is not sufficient for uploads made by the backend Cloudinary SDK.',
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
