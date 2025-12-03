#!/usr/bin/env python3
import qrcode

# Generate QR code for local server
url = "http://10.115.155.16:8000/index.html"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(url)
qr.make(fit=True)

# Print QR code to terminal
qr.print_ascii(invert=True)

print("\n" + "="*50)
print("📱 SCAN THIS QR CODE WITH YOUR PHONE")
print("="*50)
print(f"URL: {url}")
print("\nMake sure your phone is on the same WiFi network!")
print("="*50)
