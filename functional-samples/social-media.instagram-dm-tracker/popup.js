// Instagram DM Tracker - Popup Script
// Displays deleted messages history

let allMessages = [];
let filteredMessages = [];
let currentView = 'flat'; // 'flat' or 'grouped'

document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadMessages();
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all deleted messages?')) {
      clearAllMessages();
    }
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearSearchBtn.style.display = query ? 'block' : 'none';
    applyFilters();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    applyFilters();
  });

  // Filter functionality
  document.getElementById('filterType').addEventListener('change', applyFilters);
  document.getElementById('sortOrder').addEventListener('change', applyFilters);

  // View toggle functionality
  document.getElementById('flatViewBtn').addEventListener('click', () => {
    currentView = 'flat';
    document.getElementById('flatViewBtn').classList.add('active');
    document.getElementById('groupedViewBtn').classList.remove('active');
    displayMessages(filteredMessages);
  });

  document.getElementById('groupedViewBtn').addEventListener('click', () => {
    currentView = 'grouped';
    document.getElementById('groupedViewBtn').classList.add('active');
    document.getElementById('flatViewBtn').classList.remove('active');
    displayMessages(filteredMessages);
  });

  // Export functionality
  document.getElementById('exportBtn').addEventListener('click', () => {
    document.getElementById('exportModal').style.display = 'flex';
  });

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('exportModal').style.display = 'none';
  });

  document.getElementById('exportJsonBtn').addEventListener('click', () => {
    exportMessages('json');
  });

  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    exportMessages('csv');
  });

  document.getElementById('exportHtmlBtn').addEventListener('click', () => {
    exportMessages('html');
  });

  // Close modal on outside click
  document.getElementById('exportModal').addEventListener('click', (e) => {
    if (e.target.id === 'exportModal') {
      e.target.style.display = 'none';
    }
  });
}

async function loadMessages() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_DELETED_MESSAGES'
    });

    allMessages = response.messages || [];
    applyFilters();
  } catch (error) {
    console.error('Error loading messages:', error);
    showError('Failed to load messages');
  }
}

function applyFilters() {
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const filterType = document.getElementById('filterType').value;
  const sortOrder = document.getElementById('sortOrder').value;

  // Filter messages
  filteredMessages = allMessages.filter(message => {
    // Search filter
    if (searchQuery) {
      const matchText = message.text && message.text.toLowerCase().includes(searchQuery);
      const matchConversation = message.conversation && message.conversation.toLowerCase().includes(searchQuery);
      if (!matchText && !matchConversation) {
        return false;
      }
    }

    // Type filter
    if (filterType === 'text' && (!message.text || message.text.trim().length === 0)) {
      return false;
    }
    if (filterType === 'image') {
      const hasImages = (message.imageData && message.imageData.length > 0) ||
                       (message.images && message.images.length > 0);
      if (!hasImages) {
        return false;
      }
    }

    return true;
  });

  // Sort messages
  filteredMessages.sort((a, b) => {
    const timeA = a.deletedAt || a.timestamp || 0;
    const timeB = b.deletedAt || b.timestamp || 0;
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  displayMessages(filteredMessages);
  updateStats(allMessages);
}

function displayMessages(messages) {
  const messagesList = document.getElementById('messagesList');
  const emptyState = document.getElementById('emptyState');

  if (messages.length === 0) {
    emptyState.style.display = 'flex';
    messagesList.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  messagesList.style.display = 'block';
  messagesList.innerHTML = '';

  if (currentView === 'grouped') {
    displayGroupedMessages(messages, messagesList);
  } else {
    displayFlatMessages(messages, messagesList);
  }
}

function displayFlatMessages(messages, container) {
  messages.forEach(message => {
    const messageCard = createMessageCard(message);
    container.appendChild(messageCard);
  });
}

function displayGroupedMessages(messages, container) {
  // Group messages by conversation
  const grouped = {};

  messages.forEach(message => {
    const conversation = message.conversation || 'Unknown';
    if (!grouped[conversation]) {
      grouped[conversation] = [];
    }
    grouped[conversation].push(message);
  });

  // Sort conversations by most recent message
  const sortedConversations = Object.keys(grouped).sort((a, b) => {
    const latestA = Math.max(...grouped[a].map(m => m.deletedAt || m.timestamp || 0));
    const latestB = Math.max(...grouped[b].map(m => m.deletedAt || m.timestamp || 0));
    return latestB - latestA;
  });

  // Create grouped display
  sortedConversations.forEach(conversationName => {
    const conversationGroup = document.createElement('div');
    conversationGroup.className = 'conversation-group';

    const header = document.createElement('div');
    header.className = 'conversation-group-header';

    const headerTitle = document.createElement('div');
    headerTitle.className = 'conversation-group-title';
    headerTitle.textContent = conversationName;

    const headerCount = document.createElement('div');
    headerCount.className = 'conversation-group-count';
    headerCount.textContent = `${grouped[conversationName].length} message${grouped[conversationName].length > 1 ? 's' : ''}`;

    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'conversation-group-toggle';
    toggleIcon.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>
    `;

    header.appendChild(headerTitle);
    header.appendChild(headerCount);
    header.appendChild(toggleIcon);

    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'conversation-group-messages';

    grouped[conversationName].forEach(message => {
      const messageCard = createMessageCard(message);
      messagesContainer.appendChild(messageCard);
    });

    // Toggle expand/collapse
    header.addEventListener('click', () => {
      conversationGroup.classList.toggle('collapsed');
    });

    conversationGroup.appendChild(header);
    conversationGroup.appendChild(messagesContainer);
    container.appendChild(conversationGroup);
  });
}

function createMessageCard(message) {
  const card = document.createElement('div');
  card.className = 'message-card';

  const header = document.createElement('div');
  header.className = 'message-header';

  const conversationName = document.createElement('div');
  conversationName.className = 'conversation-name';
  conversationName.textContent = message.conversation || 'Unknown';

  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  timestamp.textContent = formatTimestamp(message.deletedAt);

  header.appendChild(conversationName);
  header.appendChild(timestamp);

  const body = document.createElement('div');
  body.className = 'message-body';

  // Add images if available (prefer base64 stored data, fallback to URLs)
  const imageSources = message.imageData && message.imageData.length > 0
    ? message.imageData
    : (message.images || []);

  if (imageSources.length > 0) {
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';

    imageSources.forEach((imageSource, index) => {
      const img = document.createElement('img');
      img.src = imageSource;
      img.className = 'message-image';
      img.alt = 'Deleted message image';
      img.loading = 'lazy';

      // Handle image load errors - try URL fallback if base64 fails
      img.onerror = () => {
        if (message.images && message.images[index] && imageSource !== message.images[index]) {
          img.src = message.images[index];
        } else {
          img.style.display = 'none';
        }
      };

      imagesContainer.appendChild(img);
    });

    body.appendChild(imagesContainer);
  }

  // Add text if available
  if (message.text && message.text.trim().length > 0) {
    const textContent = document.createElement('div');
    textContent.className = 'message-text';
    textContent.textContent = message.text;
    body.appendChild(textContent);
  }

  // Add actions
  const actions = document.createElement('div');
  actions.className = 'message-actions';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-icon';
  deleteBtn.title = 'Delete from history';
  deleteBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  `;
  deleteBtn.addEventListener('click', () => deleteMessage(message.id));

  if (message.url) {
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn-icon';
    viewBtn.title = 'View conversation';
    viewBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;
    viewBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: message.url });
    });
    actions.appendChild(viewBtn);
  }

  actions.appendChild(deleteBtn);

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(actions);

  return card;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function updateStats(messages) {
  const messageCount = document.getElementById('messageCount');
  messageCount.textContent = messages.length;
}

async function deleteMessage(messageId) {
  try {
    await chrome.runtime.sendMessage({
      type: 'DELETE_MESSAGE',
      messageId: messageId
    });
    loadMessages();
  } catch (error) {
    console.error('Error deleting message:', error);
    showError('Failed to delete message');
  }
}

async function clearAllMessages() {
  try {
    await chrome.runtime.sendMessage({
      type: 'CLEAR_DELETED_MESSAGES'
    });
    loadMessages();
  } catch (error) {
    console.error('Error clearing messages:', error);
    showError('Failed to clear messages');
  }
}

function showError(message) {
  const messagesList = document.getElementById('messagesList');
  messagesList.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
}

// Export functionality
function exportMessages(format) {
  const messages = filteredMessages.length > 0 ? filteredMessages : allMessages;

  if (messages.length === 0) {
    alert('No messages to export');
    return;
  }

  let content, filename, mimeType;

  switch (format) {
    case 'json':
      content = JSON.stringify(messages, null, 2);
      filename = `instagram-deleted-messages-${Date.now()}.json`;
      mimeType = 'application/json';
      break;

    case 'csv':
      content = generateCSV(messages);
      filename = `instagram-deleted-messages-${Date.now()}.csv`;
      mimeType = 'text/csv';
      break;

    case 'html':
      content = generateHTML(messages);
      filename = `instagram-deleted-messages-${Date.now()}.html`;
      mimeType = 'text/html';
      break;

    default:
      return;
  }

  downloadFile(content, filename, mimeType);
  document.getElementById('exportModal').style.display = 'none';
}

function generateCSV(messages) {
  const headers = ['Conversation', 'Message Text', 'Deleted At', 'Has Images', 'URL'];
  const rows = messages.map(msg => [
    escapeCSV(msg.conversation || ''),
    escapeCSV(msg.text || ''),
    new Date(msg.deletedAt).toLocaleString(),
    ((msg.imageData && msg.imageData.length > 0) || (msg.images && msg.images.length > 0)) ? 'Yes' : 'No',
    escapeCSV(msg.url || '')
  ]);

  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}

function escapeCSV(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateHTML(messages) {
  const messageCards = messages.map(msg => {
    const hasImages = (msg.imageData && msg.imageData.length > 0) || (msg.images && msg.images.length > 0);
    const imageSources = msg.imageData && msg.imageData.length > 0 ? msg.imageData : (msg.images || []);

    const imagesHTML = imageSources.map(src =>
      `<img src="${src}" alt="Message image" style="max-width: 300px; margin: 10px 0; border-radius: 4px;">`
    ).join('');

    return `
      <div style="border: 1px solid #dbdbdb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #efefef;">
          <strong>${escapeHTML(msg.conversation || 'Unknown')}</strong>
          <span style="color: #8e8e8e; font-size: 12px;">${new Date(msg.deletedAt).toLocaleString()}</span>
        </div>
        ${imagesHTML}
        ${msg.text ? `<p style="margin: 12px 0;">${escapeHTML(msg.text)}</p>` : ''}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Instagram Deleted Messages - Export</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
        }
        h1 {
          text-align: center;
          color: #262626;
        }
        .export-info {
          text-align: center;
          color: #8e8e8e;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <h1>Instagram Deleted Messages</h1>
      <div class="export-info">
        <p>Exported on ${new Date().toLocaleString()}</p>
        <p>Total messages: ${messages.length}</p>
      </div>
      ${messageCards}
    </body>
    </html>
  `;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
