/**
 * Formats file size from MB to human readable format
 * @param sizeInMB - Size in megabytes
 * @returns Formatted size string
 */
export const formatFileSize = (sizeInMB: number): string => {
  if (sizeInMB < 1) {
    return `${(sizeInMB * 1024).toFixed(1)} KB`;
  }
  return `${sizeInMB.toFixed(1)} MB`;
};

/**
 * Formats timestamp to readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Returns appropriate emoji icon for file type
 * @param fileType - File extension or type
 * @returns Emoji icon string
 */
export const getFileIcon = (fileType: string): string => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "🖼️";
    case "mp4":
    case "avi":
    case "mov":
      return "🎥";
    case "mp3":
    case "wav":
      return "🎵";
    default:
      return "📁";
  }
};
