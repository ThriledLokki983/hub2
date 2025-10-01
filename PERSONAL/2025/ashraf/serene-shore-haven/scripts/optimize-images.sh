#!/bin/bash

# Image optimization script
# This script compresses JPEG images in the assets folder

SOURCE_DIR="/Users/gnimoh001/projects/PERSONAL/2025/ashraf/serene-shore-haven/src/assets"
OUTPUT_DIR="/Users/gnimoh001/projects/PERSONAL/2025/ashraf/serene-shore-haven/public/images/optimized"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Starting image optimization..."

# Function to compress images
compress_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local output_file="$OUTPUT_DIR/$filename"

    # Use built-in macOS tools to compress
    echo "Compressing $filename..."

    # Use sips (built into macOS) to resize and compress
    sips -Z 1920 -s formatOptions 80 "$input_file" --out "$output_file" 2>/dev/null

    if [ $? -eq 0 ]; then
        original_size=$(stat -f%z "$input_file")
        compressed_size=$(stat -f%z "$output_file")
        echo "✓ $filename: $(($original_size/1024/1024))MB → $(($compressed_size/1024/1024))MB"
    else
        echo "✗ Failed to compress $filename"
    fi
}

# Find and compress all JPEG files
find "$SOURCE_DIR" -name "*.jpg" -o -name "*.jpeg" | while read file; do
    compress_image "$file"
done

echo "Image optimization completed!"
echo "Optimized images are in: $OUTPUT_DIR"
