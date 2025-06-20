// Storage service types

export interface UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface StorageService {
  uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<UploadResult>;
  deleteFile(fileName: string): Promise<boolean>;
  isAvailable(): boolean;
}
