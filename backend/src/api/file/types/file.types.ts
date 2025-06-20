export interface UploadPdfFileRequest {
  caseId: string;
  file: File;
}

export interface UploadPdfFileResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
  caseId: string;
  timestamp: string;
  size: number;
}
