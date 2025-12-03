#!/usr/bin/env python3
from PIL import Image

# Open the logo
logo = Image.open('images/logo_1758640761.png')

# The logo should have transparent background
# We'll just save a smaller version to use as the chilli
# You can manually crop the chilli part if needed

# For now, let's create a simple version
# Save a small version that can be used
chilli = logo.resize((40, 40), Image.Resampling.LANCZOS)
chilli.save('images/chilli.png')

print("✓ Chilli icon created at images/chilli.png")
print("  Note: You may want to manually crop just the chilli from the logo for best results")
