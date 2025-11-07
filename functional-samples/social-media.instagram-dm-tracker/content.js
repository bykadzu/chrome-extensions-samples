// Instagram DM Tracker - Content Script
// Monitors Instagram direct messages for deleted posts

class InstagramDMTracker {
  constructor() {
    this.messages = new Map();
    this.observer = null;
    this.checkInterval = null;
    this.init();
  }

  init() {
    console.log('Instagram DM Tracker initialized');

    // Wait for Instagram to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    // Give Instagram time to load the interface
    setTimeout(() => {
      this.setupObserver();
      this.startPeriodicCheck();
    }, 3000);
  }

  setupObserver() {
    // Observe changes in the message thread area
    const targetNode = document.body;

    const config = {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    };

    this.observer = new MutationObserver((mutations) => {
      this.scanMessages();
    });

    if (targetNode) {
      this.observer.observe(targetNode, config);
      console.log('MutationObserver started');
    }
  }

  startPeriodicCheck() {
    // Scan messages every 2 seconds
    this.checkInterval = setInterval(() => {
      this.scanMessages();
    }, 2000);
  }

  scanMessages() {
    const currentMessages = this.extractMessages();

    // Check for deleted messages
    this.messages.forEach((storedMessage, messageId) => {
      if (!currentMessages.has(messageId)) {
        console.log('Deleted message detected:', messageId);
        this.handleDeletedMessage(storedMessage);
      }
    });

    // Update stored messages
    this.messages = currentMessages;
  }

  extractMessages() {
    const messagesMap = new Map();

    // Instagram DM messages are typically in divs with specific roles
    // This selector targets message containers
    const messageElements = document.querySelectorAll('[role="row"], [role="listitem"]');

    messageElements.forEach((element, index) => {
      try {
        const messageData = this.extractMessageData(element, index);
        if (messageData && messageData.id) {
          messagesMap.set(messageData.id, messageData);
        }
      } catch (error) {
        // Silently continue if extraction fails
      }
    });

    return messagesMap;
  }

  extractMessageData(element, index) {
    // Generate a unique ID based on content and position
    const textContent = element.textContent || '';
    const timestamp = Date.now();

    // Try to find images
    const images = element.querySelectorAll('img');
    const imageUrls = Array.from(images)
      .map(img => img.src)
      .filter(src => src && !src.includes('emoji') && !src.includes('avatar'));

    // Try to find text content (excluding timestamps and usernames)
    const textElements = element.querySelectorAll('span, div[dir="auto"]');
    let messageText = '';

    textElements.forEach(el => {
      const text = el.textContent?.trim() || '';
      // Filter out likely UI elements
      if (text && text.length > 0 && text.length < 1000) {
        messageText += text + ' ';
      }
    });

    messageText = messageText.trim();

    // Generate ID from content hash
    const contentHash = this.generateHash(messageText + imageUrls.join(''));
    const messageId = `msg_${contentHash}_${index}`;

    // Check if this looks like an actual message
    if (messageText.length > 0 || imageUrls.length > 0) {
      return {
        id: messageId,
        text: messageText,
        images: imageUrls,
        timestamp: timestamp,
        element: element.outerHTML.substring(0, 500) // Store snippet of HTML
      };
    }

    return null;
  }

  generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async handleDeletedMessage(message) {
    console.log('Handling deleted message:', message);

    // Get the current conversation context
    const conversationName = this.getConversationName();

    const deletedPost = {
      id: message.id,
      text: message.text,
      images: message.images,
      timestamp: message.timestamp,
      deletedAt: Date.now(),
      conversation: conversationName,
      url: window.location.href
    };

    // Send to background script
    try {
      await chrome.runtime.sendMessage({
        type: 'MESSAGE_DELETED',
        data: deletedPost
      });
      console.log('Notified background script about deleted message');
    } catch (error) {
      console.error('Error sending message to background:', error);
    }
  }

  getConversationName() {
    // Try to extract conversation name from page
    const headerElements = document.querySelectorAll('header span, header a');

    for (const element of headerElements) {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        return text;
      }
    }

    return 'Unknown Conversation';
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Initialize the tracker
const tracker = new InstagramDMTracker();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  tracker.cleanup();
});
