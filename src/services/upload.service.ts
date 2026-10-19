import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../config/env';
import { UploadError } from '../errors';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_key_secret: env.CLOUDINARY_API_SECRET,
});

export class UploadService {
  /**
   * Uploads a file buffer directly to Cloudinary
   */
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = 'homepilot/general'
  ): Promise<{ url: string; publicId: string; format?: string; size: number }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(new UploadError(error?.message || 'Upload to cloud storage failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Deletes a file from Cloudinary by public ID
   */
  static async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      return false;
    }
  }
}
