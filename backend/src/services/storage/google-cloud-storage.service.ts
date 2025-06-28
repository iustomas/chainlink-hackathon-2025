// google cloud storage
import { Storage } from "@google-cloud/storage";

// stream
import { Readable } from "stream";

/**
 * Service for handling Google Cloud Storage operations
 */
export class GoogleCloudStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });

    this.bucketName = "tomas-vault";
  }

  /**
   * Upload a file to Google Cloud Storage
   * @param fileBuffer - The file buffer to upload
   * @param fileName - The name to give the file in storage
   * @param contentType - The MIME type of the file
   * @returns Promise with the public URL of the uploaded file
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(
          file.createWriteStream({
            metadata: {
              contentType,
            },
            resumable: false,
          })
        )
        .on("error", (error) => {
          console.error("Error uploading file to GCS:", error);
          reject(error);
        })
        .on("finish", () => {
          console.log(`File ${fileName} uploaded successfully to GCS`);
          resolve();
        });
    });

    // Note: With uniform bucket-level access enabled, individual file permissions
    // cannot be set. The bucket must be configured as public at the bucket level.
    // To make files publicly accessible, configure the bucket permissions in the
    // Google Cloud Console or use signed URLs for secure access.

    // Return the public URL (assumes bucket is configured as public)
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  /**
   * Delete a file from Google Cloud Storage
   * @param fileName - The name of the file to delete
   */
  async deleteFile(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    await file.delete();
    console.log(`File ${fileName} deleted successfully from GCS`);
  }

  /**
   * Check if a file exists in Google Cloud Storage
   * @param fileName - The name of the file to check
   * @returns Promise<boolean> - True if file exists, false otherwise
   */
  async fileExists(fileName: string): Promise<boolean> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    return exists;
  }

  /**
   * Get the public URL of a file
   * @param fileName - The name of the file
   * @returns The public URL of the file
   */
  getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }
}

// Export singleton instance
export const googleCloudStorageService = new GoogleCloudStorageService();
