// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(tabName).classList.add('active');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Get current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0].url;
  document.getElementById('currentUrl').value = currentUrl;
});

// Shorten link
document.getElementById('shortenBtn').addEventListener('click', async () => {
  const url = document.getElementById('currentUrl').value;
  const customCode = document.getElementById('customCode').value;
  const tags = document.getElementById('tags').value;
  const generateQr = document.getElementById('generateQr').checked;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').style.display = 'none';
  document.getElementById('result').classList.remove('show');

  try {
    const response = await fetch('http://localhost:3000/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: url,
        customCode: customCode || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('resultUrl').textContent = data.shortUrl;
      document.getElementById('result').classList.add('show');
      
      if (generateQr) {
        document.getElementById('qrBtn').style.display = 'inline-block';
      }
    } else {
      throw new Error(data.error || 'Failed to shorten link');
    }
  } catch (error) {
    document.getElementById('error').textContent = error.message || 'Failed to shorten link';
    document.getElementById('error').style.display = 'block';
  }

  document.getElementById('loading').style.display = 'none';
});

// Copy to clipboard
document.getElementById('copyBtn').addEventListener('click', async () => {
  const url = document.getElementById('resultUrl').textContent;
  try {
    await navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  } catch (err) {
    alert('Failed to copy');
  }
});

// Download QR
document.getElementById('qrBtn').addEventListener('click', () => {
  const shortUrl = document.getElementById('resultUrl').textContent;
  const shortCode = shortUrl.split('/').pop();
  window.open(`http://localhost:3000/dashboard?qr=${shortCode}`, '_blank');
});

// Open dashboard
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
});

// Save settings
document.getElementById('saveSettings').addEventListener('click', () => {
  const apiToken = document.getElementById('apiToken').value;
  const autoShorten = document.getElementById('autoShorten').checked;
  const showQrDefault = document.getElementById('showQrDefault').checked;
  
  chrome.storage.local.set({
    apiToken,
    autoShorten,
    showQrDefault
  }, () => {
    alert('Settings saved!');
  });
});

// Load settings
chrome.storage.local.get(['apiToken', 'autoShorten', 'showQrDefault'], (result) => {
  if (result.apiToken) {
    document.getElementById('apiToken').value = result.apiToken;
  }
  if (result.autoShorten !== undefined) {
    document.getElementById('autoShorten').checked = result.autoShorten;
  }
  if (result.showQrDefault !== undefined) {
    document.getElementById('showQrDefault').checked = result.showQrDefault;
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  chrome.storage.local.clear(() => {
    alert('Logged out');
    location.reload();
  });
});

