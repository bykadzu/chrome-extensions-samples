# Changelog

All notable changes to the Instagram DM Tracker extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-07

### Added
- **Local Image Storage**: Images are now downloaded and stored as base64 data to prevent broken URLs when Instagram removes them from their CDN
  - Automatic download of up to 5 images per message
  - 500KB size limit per image for storage efficiency
  - Fallback to URL if base64 storage fails
- **Search & Filter Functionality**:
  - Search bar to find messages by text content or conversation name
  - Filter by content type (All, Text Only, With Images)
  - Sort options (Newest First, Oldest First)
  - Clear search button for quick reset
- **Export Functionality**: Export your deleted messages in multiple formats
  - JSON export with full message data structure
  - CSV export for spreadsheet analysis
  - HTML export with styled, printable format
  - Export includes images embedded as base64 in HTML format
- **Conversation Grouping**:
  - Toggle between flat list view and grouped by conversation view
  - Collapsible conversation groups
  - Message count per conversation
  - Conversations sorted by most recent activity
- **Enhanced UI**:
  - Modern search interface with icon
  - Filter dropdowns with smooth transitions
  - View toggle buttons (List / Group by Chat)
  - Export modal with format selection
  - Improved responsive design

### Changed
- Message extraction now asynchronous to support image downloading
- Images display with base64 data priority, falling back to URLs
- Popup width optimized for new search and filter controls
- Action buttons layout improved to accommodate export button

### Technical
- Updated `content.js` to download images and convert to base64
- Enhanced `popup.js` with filtering, searching, and grouping logic
- Added export generation functions for JSON, CSV, and HTML
- Expanded `styles.css` with new component styles
- All changes maintain backward compatibility with v1.0.0 data

### Performance
- Image downloads limited to 500KB per image
- Maximum 5 images per message to prevent storage bloat
- Efficient filtering using Array methods
- Lazy render for grouped conversations

## [1.0.0] - 2025-11-07

### Added
- Initial release of Instagram DM Tracker
- Real-time monitoring of Instagram Direct Messages
- Desktop notifications when messages are deleted
- Storage of deleted message text and image URLs
- Extension popup with message history
- Badge counter showing number of deleted messages
- Conversation context (shows which chat the message was from)
- Delete individual messages from history
- Clear all messages functionality
- Modern Instagram-inspired UI design
- Manifest V3 compliance

### Features
- Content script monitors Instagram DM page
- MutationObserver for detecting DOM changes
- Background service worker for notifications and storage
- Up to 100 messages stored locally
- Message deduplication using content hashing
- Responsive design
- Error handling and fallback mechanisms

### Permissions
- `storage` - Store deleted messages locally
- `notifications` - Show desktop notifications
- `alarms` - Periodic checks and maintenance
- `host_permissions` - Access instagram.com for monitoring

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features in future versions:
- v1.2: Password protection, voice/video support, dark mode
- v2.0: Cloud backup, cross-device sync, edit tracking
- v2.1: OCR for images, analytics dashboard, webhooks
- v3.0: Multi-platform support, ML features, mobile app

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
