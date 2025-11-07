// Instagram DM Tracker - Popup Script
// Displays deleted messages history

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
}

async function loadMessages() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_DELETED_MESSAGES'
    });

    const messages = response.messages || [];
    displayMessages(messages);
    updateStats(messages);
  } catch (error) {
    console.error('Error loading messages:', error);
    showError('Failed to load messages');
  }
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

  messages.forEach(message => {
    const messageCard = createMessageCard(message);
    messagesList.appendChild(messageCard);
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

  // Add images if available
  if (message.images && message.images.length > 0) {
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';

    message.images.forEach(imageUrl => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.className = 'message-image';
      img.alt = 'Deleted message image';
      img.loading = 'lazy';

      // Handle image load errors
      img.onerror = () => {
        img.style.display = 'none';
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
