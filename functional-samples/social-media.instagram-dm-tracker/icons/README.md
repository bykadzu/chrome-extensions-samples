# Extension Icons

This directory contains the icons for the Instagram DM Tracker extension.

## Required Icons

You need to create three PNG files:
- `icon16.png` (16x16 pixels) - Toolbar icon
- `icon48.png` (48x48 pixels) - Extension management page
- `icon128.png` (128x128 pixels) - Chrome Web Store and installation

## Creating Icons

### Option 1: Convert the SVG (Recommended)

Use the provided `icon.svg` file and convert it to PNG at different sizes:

**Using ImageMagick (command line):**
```bash
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

**Using Inkscape (command line):**
```bash
inkscape icon.svg --export-filename=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-filename=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

**Using Online Tools:**
1. Go to [CloudConvert](https://cloudconvert.com/svg-to-png) or similar
2. Upload `icon.svg`
3. Convert to PNG at each required size
4. Download and rename to the correct filenames

**Using Design Software:**
- Open `icon.svg` in Figma, Adobe Illustrator, or Sketch
- Export as PNG at 16x16, 48x48, and 128x128 pixels

### Option 2: Create Your Own Icons

Design your own icons that represent the extension's functionality:
- Use Instagram's color scheme (gradient from purple to orange/red)
- Include visual elements suggesting messaging or tracking
- Keep the design simple and recognizable at small sizes
- Ensure the 16x16 icon is still clear and identifiable

### Design Guidelines

- **Style**: Modern, flat design with Instagram's gradient colors
- **Elements**: Message bubble, eye (for tracking), or notification indicators
- **Colors**: Instagram gradient (#405de6, #5851db, #833ab4, #c13584, #fd1d1d)
- **Background**: Rounded square (similar to Instagram's app icon)
- **16x16 size**: Keep it simple - just the main symbol
- **48x48 & 128x128**: Can include more detail

## Quick Start

If you want to test the extension immediately without custom icons, you can:

1. Create simple placeholder icons using any image editor
2. Use a screenshot of the Instagram logo (not recommended for distribution)
3. Use the provided SVG and convert it as shown above

## Notes

- Icons should have a transparent background for best results
- PNG format is required by Chrome extensions
- Higher resolution icons (128x128) are used in the Chrome Web Store
- The 16x16 icon appears in the browser toolbar, so clarity is essential
