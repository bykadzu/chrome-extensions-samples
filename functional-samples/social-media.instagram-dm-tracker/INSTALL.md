# Installation Guide

Quick start guide for installing and using the Instagram DM Tracker extension.

## Prerequisites

- Google Chrome or Chromium-based browser (Edge, Brave, Opera, etc.)
- Access to Instagram Direct Messages

## Step-by-Step Installation

### 1. Get the Extension Files

Clone or download the chrome-extensions-samples repository:
```bash
git clone https://github.com/GoogleChrome/chrome-extensions-samples.git
cd chrome-extensions-samples/functional-samples/social-media.instagram-dm-tracker
```

Or download just this extension folder directly.

### 2. Create Icons

The extension requires three icon files. Choose one method:

**Option A: Use the provided script (fastest)**
```bash
cd icons
./create-placeholder-icons.sh
```

**Option B: Convert the SVG manually**
```bash
cd icons
# If you have ImageMagick:
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

**Option C: Create your own icons**
- Create three PNG files: `icon16.png`, `icon48.png`, `icon128.png`
- Place them in the `icons/` directory
- See `icons/README.md` for detailed guidelines

### 3. Load the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `social-media.instagram-dm-tracker` directory
6. The extension icon should appear in your browser toolbar

### 4. Grant Permissions

When you first install:
- The extension will request permission to access Instagram.com
- Click **Allow** to enable tracking functionality

### 5. Start Using

1. Navigate to [instagram.com/direct](https://www.instagram.com/direct/)
2. Log in to your Instagram account if needed
3. The extension will automatically start monitoring for deleted messages
4. Click the extension icon to view the history of deleted messages

## Verifying Installation

To confirm the extension is working:

1. Open Instagram Direct Messages
2. Open Chrome DevTools (F12 or Ctrl+Shift+I)
3. Go to the **Console** tab
4. You should see: `Instagram DM Tracker initialized`
5. Send a test message and delete it (in a conversation with yourself or a test account)
6. Check if a notification appears
7. Click the extension icon to see the deleted message in the history

## Troubleshooting

### Extension won't load
- Make sure all required files are present (manifest.json, content.js, background.js, popup.html, popup.js, styles.css)
- Check that icons are in the `icons/` directory
- Try reloading the extension from chrome://extensions/

### No console message appears
- Refresh the Instagram Direct Messages page
- Make sure you're on instagram.com/direct/* (not just instagram.com)
- Check for JavaScript errors in the console

### Notifications don't appear
- Check Chrome notification settings: chrome://settings/content/notifications
- Make sure Chrome has permission to show notifications
- Check if notifications are enabled for the extension

### Icons are missing
- Make sure you've created the icon files (see Step 2 above)
- Run the `create-placeholder-icons.sh` script in the icons directory
- Verify the files exist: `ls icons/*.png`

## Updating the Extension

If you make changes to the extension:

1. Go to `chrome://extensions/`
2. Click the refresh icon on the extension card
3. Reload any open Instagram pages

## Uninstalling

1. Go to `chrome://extensions/`
2. Click **Remove** on the Instagram DM Tracker card
3. Confirm the removal

All locally stored data will be deleted when you remove the extension.

## Next Steps

- Read the [README.md](README.md) for detailed feature documentation
- Check the privacy and limitations sections
- Customize the extension if needed

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify you're using a Chromium-based browser
3. Ensure Instagram is working normally in your browser
4. Try disabling other Instagram-related extensions

## Development Mode

To modify the extension:
1. Make changes to the source files
2. Reload the extension from chrome://extensions/
3. Refresh the Instagram page
4. Check the console for any errors

Happy tracking!
