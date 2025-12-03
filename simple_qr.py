#!/usr/bin/env python3
import qrcode

# Simple QR code generation - exactly as recommended in qrcode docs
url = "http://10.115.142.138:8000/index.html"

# Use the simplest method
img = qrcode.make(url)
img.save('qr-code-hq.png')

print(f"✓ Simple QR code saved")
print(f"  URL: {url}")
print(f"  Length: {len(url)} characters")
