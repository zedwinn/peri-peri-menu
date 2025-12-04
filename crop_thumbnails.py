#!/usr/bin/env python3
"""
Auto-crop thumbnail images to 9:16 aspect ratio for Peri Peri menu
Processes all *_thumbnail.jpg files in the images folder
"""
from PIL import Image
import os
import sys

# Target aspect ratio (9:16 for portrait Instagram/TikTok style)
TARGET_RATIO = 9 / 16  # 0.5625

def crop_to_aspect_ratio(image_path, output_path=None):
    """
    Crop an image to 9:16 aspect ratio, centered

    Args:
        image_path: Path to input image
        output_path: Path to save cropped image (if None, overwrites original)
    """
    try:
        # Open image
        img = Image.open(image_path)
        original_width, original_height = img.size
        original_ratio = original_width / original_height

        print(f"\nProcessing: {os.path.basename(image_path)}")
        print(f"  Original size: {original_width} x {original_height}")
        print(f"  Original ratio: {original_ratio:.4f}")

        # Calculate target dimensions
        if original_ratio > TARGET_RATIO:
            # Image is too wide, crop width
            new_width = int(original_height * TARGET_RATIO)
            new_height = original_height
            left = (original_width - new_width) // 2
            top = 0
            right = left + new_width
            bottom = original_height
        else:
            # Image is too tall, crop height
            new_width = original_width
            new_height = int(original_width / TARGET_RATIO)
            left = 0
            top = (original_height - new_height) // 2
            right = original_width
            bottom = top + new_height

        # Crop image (centered)
        cropped_img = img.crop((left, top, right, bottom))

        # Save
        save_path = output_path if output_path else image_path
        cropped_img.save(save_path, quality=95, optimize=True)

        print(f"  ✓ Cropped to: {new_width} x {new_height}")
        print(f"  ✓ New ratio: {new_width/new_height:.4f} (target: {TARGET_RATIO:.4f})")
        print(f"  ✓ Saved to: {os.path.basename(save_path)}")

        return True

    except Exception as e:
        print(f"  ✗ Error processing {image_path}: {e}")
        return False

def process_thumbnails(images_dir="images", pattern="_thumbnail.jpg"):
    """
    Process all thumbnail images in the images directory

    Args:
        images_dir: Directory containing images
        pattern: File pattern to match (default: _thumbnail.jpg)
    """
    # Get absolute path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_path = os.path.join(script_dir, images_dir)

    if not os.path.exists(images_path):
        print(f"Error: Images directory not found: {images_path}")
        return

    # Find all thumbnail files
    thumbnail_files = [
        f for f in os.listdir(images_path)
        if f.endswith(pattern)
    ]

    if not thumbnail_files:
        print(f"No thumbnail files found matching pattern '*{pattern}' in {images_dir}/")
        return

    print(f"Found {len(thumbnail_files)} thumbnail(s) to process:")
    print("=" * 60)

    # Process each thumbnail
    success_count = 0
    for filename in sorted(thumbnail_files):
        file_path = os.path.join(images_path, filename)
        if crop_to_aspect_ratio(file_path):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"✓ Successfully processed {success_count}/{len(thumbnail_files)} thumbnails")
    print(f"  Target aspect ratio: 9:16 ({TARGET_RATIO:.4f})")

if __name__ == "__main__":
    print("🔥 Peri Peri Grill - Thumbnail Auto-Crop Tool")
    print("=" * 60)

    # Check if PIL is available
    try:
        from PIL import Image
    except ImportError:
        print("\n✗ Error: Pillow library not installed")
        print("  Install it with: pip3 install Pillow")
        sys.exit(1)

    # Process all thumbnails
    process_thumbnails()

    print("\n📱 Thumbnails are now optimized for your menu!")
    print("   They will perfectly fit the Instagram-style grid.")
