// Instagram DM Tracker - Background Service Worker
// Handles notifications and storage of deleted messages

const STORAGE_KEY = 'deletedMessages';
const MAX_STORED_MESSAGES = 100;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'MESSAGE_DELETED') {
    handleDeletedMessage(request.data);
    sendResponse({ success: true });
  }
  return true;
});

async function handleDeletedMessage(deletedPost) {
  console.log('Background: Handling deleted message', deletedPost);

  // Store the deleted message
  await storeDeletedMessage(deletedPost);

  // Show notification
  await showNotification(deletedPost);

  // Update badge
  await updateBadge();
}

async function storeDeletedMessage(deletedPost) {
  try {
    // Get existing messages
    const result = await chrome.storage.local.get(STORAGE_KEY);
    let messages = result[STORAGE_KEY] || [];

    // Add new message at the beginning
    messages.unshift(deletedPost);

    // Limit stored messages
    if (messages.length > MAX_STORED_MESSAGES) {
      messages = messages.slice(0, MAX_STORED_MESSAGES);
    }

    // Save back to storage
    await chrome.storage.local.set({ [STORAGE_KEY]: messages });
    console.log('Message stored successfully');
  } catch (error) {
    console.error('Error storing message:', error);
  }
}

async function showNotification(deletedPost) {
  try {
    const notificationOptions = {
      type: 'basic',
      iconUrl: deletedPost.images && deletedPost.images.length > 0
        ? deletedPost.images[0]
        : 'icons/icon128.png',
      title: 'Instagram Message Deleted',
      message: createNotificationMessage(deletedPost),
      priority: 2,
      requireInteraction: false
    };

    // Add image if available
    if (deletedPost.images && deletedPost.images.length > 0) {
      notificationOptions.type = 'image';
      notificationOptions.imageUrl = deletedPost.images[0];
    }

    await chrome.notifications.create(
      `deleted_${deletedPost.id}`,
      notificationOptions
    );

    console.log('Notification shown');
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

function createNotificationMessage(deletedPost) {
  const conversation = deletedPost.conversation || 'Unknown';
  const text = deletedPost.text || '[Image/Media]';
  const preview = text.length > 100 ? text.substring(0, 97) + '...' : text;

  return `From: ${conversation}\n${preview}`;
}

async function updateBadge() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const messages = result[STORAGE_KEY] || [];
    const count = messages.length;

    if (count > 0) {
      await chrome.action.setBadgeText({ text: count.toString() });
      await chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open the extension popup or Instagram
  chrome.action.openPopup();
});

// Initialize badge on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Instagram DM Tracker installed');
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Instagram DM Tracker started');
  updateBadge();
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[STORAGE_KEY]) {
    updateBadge();
  }
});

// Provide API for popup to get messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_DELETED_MESSAGES') {
    chrome.storage.local.get(STORAGE_KEY).then(result => {
      sendResponse({ messages: result[STORAGE_KEY] || [] });
    });
    return true;
  }

  if (request.type === 'CLEAR_DELETED_MESSAGES') {
    chrome.storage.local.set({ [STORAGE_KEY]: [] }).then(() => {
      updateBadge();
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'DELETE_MESSAGE') {
    chrome.storage.local.get(STORAGE_KEY).then(result => {
      let messages = result[STORAGE_KEY] || [];
      messages = messages.filter(msg => msg.id !== request.messageId);
      chrome.storage.local.set({ [STORAGE_KEY]: messages }).then(() => {
        updateBadge();
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
