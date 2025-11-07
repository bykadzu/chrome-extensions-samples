#!/bin/bash

# Create placeholder icons for Instagram DM Tracker
# This script creates simple placeholder PNG files if you don't have proper icons yet

echo "Creating placeholder icons..."

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create icons..."

    # Create colored placeholder icons
    convert -size 16x16 xc:'#E1306C' icon16.png
    convert -size 48x48 xc:'#E1306C' icon48.png
    convert -size 128x128 xc:'#E1306C' icon128.png

    echo "Placeholder icons created successfully!"
    echo "Replace these with proper icons using the icon.svg template."

elif command -v python3 &> /dev/null; then
    echo "Using Python to create icons..."

    python3 << 'EOF'
try:
    from PIL import Image, ImageDraw

    # Instagram pink color
    color = (225, 48, 108)

    # Create icons
    for size in [16, 48, 128]:
        img = Image.new('RGB', (size, size), color)
        draw = ImageDraw.Draw(img)

        # Add a simple white border
        border = max(1, size // 16)
        draw.rectangle([(0, 0), (size-1, size-1)], outline=(255, 255, 255), width=border)

        img.save(f'icon{size}.png')

    print("Placeholder icons created successfully!")
    print("Replace these with proper icons using the icon.svg template.")
except ImportError:
    print("Error: PIL/Pillow not installed")
    print("Install with: pip install Pillow")
    exit(1)
EOF

else
    echo "Error: Neither ImageMagick nor Python with PIL is available"
    echo "Please create icons manually or install one of these tools:"
    echo "  - ImageMagick: sudo apt-get install imagemagick"
    echo "  - Python PIL: pip install Pillow"
    echo ""
    echo "Required files:"
    echo "  - icon16.png (16x16 pixels)"
    echo "  - icon48.png (48x48 pixels)"
    echo "  - icon128.png (128x128 pixels)"
    exit 1
fi
