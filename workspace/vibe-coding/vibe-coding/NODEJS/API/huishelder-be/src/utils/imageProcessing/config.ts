// Image processing configuration options
export interface ImageSize {
  name: string;
  width: number;
  height?: number; // Optional height for fixed aspect ratio
}

export interface ImageProcessingOptions {
  // Define the various sizes to generate
  sizes: ImageSize[];
  // Quality for JPEG/WebP compression (0-100)
  quality: number;
  // Whether to convert images to WebP format in addition to original format
  generateWebP: boolean;
  // Output directory structure
  outputDir: string;
}

// Default configuration
export const defaultConfig: ImageProcessingOptions = {
  sizes: [
    { name: 'thumbnail', width: 150 },
    { name: 'medium', width: 600 },
    { name: 'large', width: 1200 },
  ],
  quality: 80,
  generateWebP: true,
  outputDir: 'uploads',
};
