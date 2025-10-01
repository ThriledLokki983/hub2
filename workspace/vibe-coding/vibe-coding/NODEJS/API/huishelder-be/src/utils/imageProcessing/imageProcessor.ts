import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { ImageProcessingOptions, defaultConfig } from './config';
import { logger } from '../logger';

export interface ProcessedImage {
  originalPath: string; // Original file path
  originalFilename: string; // Original filename with extension
  filename: string; // Filename without extension
  extension: string; // File extension without dot
  mimetype: string; // MIME type
  sizes: {
    [key: string]: {
      path: string; // Full path to the processed image
      url: string; // URL to access the image
      width: number; // Width of the image
      height: number; // Height of the image
      format: string; // Format of the image (jpeg, png, webp, etc.)
      size: number; // File size in bytes
    };
  };
}

export class ImageProcessor {
  private options: ImageProcessingOptions;

  constructor(options?: Partial<ImageProcessingOptions>) {
    this.options = { ...defaultConfig, ...options };
  }

  /**
   * Process an uploaded image to generate multiple sizes and formats
   */
  public async processImage(file: Express.Multer.File, baseUrl: string): Promise<ProcessedImage> {
    try {
      const { filename: originalFilename, path: originalPath, mimetype } = file;
      const { name: filename, ext: extension } = path.parse(originalFilename);

      // Ensure output directories exist
      await this.ensureDirectoriesExist();

      // Get image metadata
      const metadata = await sharp(originalPath).metadata();

      // Process each size variant
      const sizes: ProcessedImage['sizes'] = {};

      // Original file info
      const originalStats = await fs.stat(originalPath);

      // Add the original file to sizes
      sizes.original = {
        path: originalPath,
        url: `${baseUrl}/${this.options.outputDir}/${originalFilename}`,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: extension.replace('.', ''),
        size: originalStats.size,
      };

      // Process each configured size
      for (const size of this.options.sizes) {
        // Process original format
        const outputFilename = `${filename}-${size.name}${extension}`;
        const outputPath = path.join(process.cwd(), this.options.outputDir, outputFilename);

        // Resize image
        await this.resizeAndSave(originalPath, outputPath, size.width, size.height);

        // Get stats for the resized file
        const stats = await fs.stat(outputPath);
        const resizedMetadata = await sharp(outputPath).metadata();

        // Store info about this size
        sizes[size.name] = {
          path: outputPath,
          url: `${baseUrl}/${this.options.outputDir}/${outputFilename}`,
          width: resizedMetadata.width || size.width,
          height: resizedMetadata.height || size.height || 0,
          format: extension.replace('.', ''),
          size: stats.size,
        };

        // Generate WebP version if enabled
        if (this.options.generateWebP) {
          const webpFilename = `${filename}-${size.name}.webp`;
          const webpPath = path.join(process.cwd(), this.options.outputDir, webpFilename);

          await this.convertToWebP(outputPath, webpPath);

          const webpStats = await fs.stat(webpPath);
          const webpMetadata = await sharp(webpPath).metadata();

          // Store info about WebP version
          sizes[`${size.name}-webp`] = {
            path: webpPath,
            url: `${baseUrl}/${this.options.outputDir}/${webpFilename}`,
            width: webpMetadata.width || size.width,
            height: webpMetadata.height || size.height || 0,
            format: 'webp',
            size: webpStats.size,
          };
        }
      }

      return {
        originalPath,
        originalFilename,
        filename,
        extension: extension.replace('.', ''),
        mimetype,
        sizes,
      };
    } catch (error) {
      logger.error(`Error processing image: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resize an image and save to the specified path
   */
  private async resizeAndSave(inputPath: string, outputPath: string, width: number, height?: number): Promise<void> {
    try {
      const resizeOptions = height ? { width, height } : { width };

      await sharp(inputPath).resize(resizeOptions).jpeg({ quality: this.options.quality }).png({ quality: this.options.quality }).toFile(outputPath);
    } catch (error) {
      logger.error(`Error resizing image: ${error.message}`);
      throw error;
    }
  }

  /**
   * Convert an image to WebP format and save
   */
  private async convertToWebP(inputPath: string, outputPath: string): Promise<void> {
    try {
      await sharp(inputPath).webp({ quality: this.options.quality }).toFile(outputPath);
    } catch (error) {
      logger.error(`Error converting to WebP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ensure all required directories exist
   */
  private async ensureDirectoriesExist(): Promise<void> {
    try {
      const uploadsDir = path.join(process.cwd(), this.options.outputDir);
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      logger.error(`Error creating directories: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete all generated images for a file
   */
  public async deleteProcessedImages(processedImage: ProcessedImage): Promise<void> {
    try {
      // Delete all size variants
      for (const sizeKey in processedImage.sizes) {
        const { path: imagePath } = processedImage.sizes[sizeKey];

        try {
          await fs.access(imagePath);
          await fs.unlink(imagePath);
        } catch (error) {
          logger.warn(`Could not delete image at ${imagePath}: ${error.message}`);
        }
      }
    } catch (error) {
      logger.error(`Error deleting processed images: ${error.message}`);
      throw error;
    }
  }
}
