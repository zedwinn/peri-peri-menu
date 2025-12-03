#!/usr/bin/env python3
import qrcode
import qrcode.image.svg

# Generate QR code for local server
url = "http://10.115.142.138:8000/index.html"

# Create a larger, clearer QR code
qr = qrcode.QRCode(
    version=3,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=8,
    border=2,
)

qr.add_data(url)
qr.make(fit=True)

# Print QR code to terminal with better contrast
print("\n\n")
qr.print_ascii(invert=True)
print("\n")
qr.print_tty()

print("\n" + "="*60)
print("📱 PERI PERI GRILL - SCAN TO VIEW MENU")
print("="*60)
print(f"URL: {url}")
print("\n🔍 TROUBLESHOOTING:")
print("1. Ensure phone & Mac are on the SAME WiFi network")
print("2. Try typing the URL directly in your phone browser")
print("3. If scanning fails, try a QR scanner app")
print("4. Check if your Mac firewall is blocking connections")
print("="*60 + "\n")
