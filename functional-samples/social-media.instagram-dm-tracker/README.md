# Instagram DM Tracker

A Chrome extension that tracks deleted Instagram DM posts with notifications and photo storage.

## Features

- **Real-time Monitoring**: Automatically monitors Instagram Direct Messages for deleted posts
- **Photo Storage**: Saves thumbnails and images from deleted messages
- **Text Preservation**: Captures and stores message text content
- **Desktop Notifications**: Instantly notifies you when a message is deleted
- **History View**: Browse all deleted messages in a beautiful popup interface
- **Conversation Context**: Shows which conversation the deleted message was from
- **Badge Counter**: Displays the number of deleted messages on the extension icon

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `functional-samples/social-media.instagram-dm-tracker` directory

### Icon Setup

The extension requires icons in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create these icons or use any Instagram-themed icons you prefer.

## Usage

1. **Install the Extension**: Follow the installation steps above
2. **Open Instagram**: Navigate to [instagram.com/direct](https://www.instagram.com/direct/)
3. **Start Monitoring**: The extension automatically begins tracking messages
4. **View Deleted Messages**: Click the extension icon to see the history of deleted messages
5. **Get Notifications**: Receive desktop notifications when messages are deleted

## How It Works

### Content Script (`content.js`)
- Monitors the Instagram Direct Messages page using MutationObserver
- Tracks all visible messages and their content
- Detects when messages are removed from the DOM
- Extracts text, images, and metadata from messages
- Sends deleted message data to the background service worker

### Background Service Worker (`background.js`)
- Receives deleted message data from the content script
- Stores messages in Chrome's local storage (up to 100 messages)
- Creates desktop notifications with message previews
- Updates the extension badge with the count of deleted messages
- Provides API for the popup to retrieve and manage messages

### Popup Interface (`popup.html`, `popup.js`, `styles.css`)
- Displays a history of all deleted messages
- Shows message text, images, timestamps, and conversation names
- Allows users to delete individual messages or clear all history
- Provides a refresh button to reload the latest data
- Features a modern, Instagram-inspired design

## Privacy & Data

- All data is stored locally on your device using Chrome's storage API
- No data is sent to external servers
- Messages are stored until you manually clear them
- Maximum of 100 messages are stored at a time (older messages are automatically removed)

## Permissions

The extension requires the following permissions:

- **storage**: To save deleted messages locally
- **notifications**: To show desktop notifications when messages are deleted
- **alarms**: For periodic checks and maintenance
- **host_permissions (instagram.com)**: To monitor Instagram Direct Messages

## Limitations

- Only works on Instagram Direct Messages (`instagram.com/direct/*`)
- Requires the Instagram page to be open to track messages
- May not detect all message deletions if the page is not actively loaded
- Instagram's dynamic interface may require occasional updates to the extension
- Images are stored as URLs and may expire if Instagram removes them from their servers

## Troubleshooting

### Extension not tracking messages
1. Make sure you're on the Instagram Direct Messages page (`instagram.com/direct/*`)
2. Refresh the Instagram page
3. Check the browser console for any errors
4. Reload the extension from `chrome://extensions/`

### Notifications not showing
1. Check Chrome's notification settings
2. Ensure notifications are enabled for Chrome
3. Check if notifications are blocked for the extension

### Images not loading
- Some images may expire if Instagram removes them from their CDN
- The extension stores image URLs, not the actual image files

## Development

### File Structure
```
social-media.instagram-dm-tracker/
├── manifest.json          # Extension configuration
├── content.js            # Instagram page monitoring script
├── background.js         # Service worker for notifications and storage
├── popup.html           # Popup interface HTML
├── popup.js             # Popup interface logic
├── styles.css           # Popup interface styles
├── icons/               # Extension icons (16, 48, 128px)
└── README.md            # This file
```

### Testing

1. Load the extension in Chrome
2. Open Instagram Direct Messages
3. Open Chrome DevTools and check the Console tab
4. Send and delete test messages
5. Verify notifications appear
6. Check the extension popup shows deleted messages

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This extension is part of the Chrome Extensions Samples repository and is available under the Apache License 2.0.

## Disclaimer

This extension is for educational purposes. Use responsibly and in accordance with Instagram's Terms of Service. The extension does not interfere with Instagram's functionality or violate user privacy - it only observes what is already displayed in your browser.

## Version History

### 1.0.0 (Initial Release)
- Real-time message deletion tracking
- Photo and text storage
- Desktop notifications
- History popup interface
- Conversation context
- Badge counter
