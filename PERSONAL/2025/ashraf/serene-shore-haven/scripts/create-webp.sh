#!/bin/bash

# Enhanced image optimization script with WebP support
# This script creates multiple formats for better browser support

SOURCE_DIR="/Users/gnimoh001/projects/PERSONAL/2025/ashraf/serene-shore-haven/src/assets"
OUTPUT_DIR="/Users/gnimoh001/projects/PERSONAL/2025/ashraf/serene-shore-haven/public/images"

# Create output directories
mkdir -p "$OUTPUT_DIR/optimized"
mkdir -p "$OUTPUT_DIR/webp"
mkdir -p "$OUTPUT_DIR/thumbnails"

echo "Starting enhanced image optimization..."

# Function to create WebP versions
create_webp() {
    local input_file="$1"
    local filename=$(basename "$input_file" .jpg)
    local webp_file="$OUTPUT_DIR/webp/$filename.webp"
    local thumb_file="$OUTPUT_DIR/thumbnails/$filename.jpg"

    echo "Creating WebP and thumbnail for $filename..."

    # Create WebP version (even better compression)
    sips -s format webp -s formatOptions 80 "$input_file" --out "$webp_file" 2>/dev/null

    # Create thumbnail (400px wide)
    sips -Z 400 -s formatOptions 70 "$input_file" --out "$thumb_file" 2>/dev/null

    if [ -f "$webp_file" ]; then
        webp_size=$(stat -f%z "$webp_file")
        echo "✓ WebP: $filename.webp ($(($webp_size/1024))KB)"
    fi

    if [ -f "$thumb_file" ]; then
        thumb_size=$(stat -f%z "$thumb_file")
        echo "✓ Thumbnail: $filename.jpg ($(($thumb_size/1024))KB)"
    fi
}

# Process key images for WebP
echo "Creating WebP versions of key images..."
create_webp "$SOURCE_DIR/sea-view-2.jpg"
create_webp "$SOURCE_DIR/201/desert-view-1.jpg"
create_webp "$SOURCE_DIR/sea-view-1.jpg"

echo "Enhanced image optimization completed!"
echo "Check the following directories:"
echo "- Optimized JPEG: $OUTPUT_DIR/optimized/"
echo "- WebP versions: $OUTPUT_DIR/webp/"
echo "- Thumbnails: $OUTPUT_DIR/thumbnails/"
