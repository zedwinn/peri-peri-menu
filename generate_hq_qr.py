#!/usr/bin/env python3
"""
Generate a high-quality QR code for Peri Peri Grill menu
"""
import qrcode

# Configuration
url = "https://zedwinn.github.io/peri-peri-menu/"
output_file = "qr-code-hq.png"

# Create QR code with high error correction
qr = qrcode.QRCode(
    version=4,  # Larger version for better clarity
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # Highest error correction
    box_size=15,  # Larger box size for clarity
    border=3,
)

qr.add_data(url)
qr.make(fit=True)

# Create the image with standard black/white for better compatibility
img = qr.make_image(
    fill_color="black",
    back_color="white"
)

# Save the high-quality image
img.save(output_file, quality=100)

print(f"✓ High-quality QR code saved to: {output_file}")
print(f"  URL: {url}")
print(f"\n📱 Open '{output_file}' and scan with your phone!")
print(f"   The QR code is in Peri Peri red color for branding!")
