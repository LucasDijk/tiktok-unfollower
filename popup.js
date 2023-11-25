// Load delay time from storage
chrome.storage.sync.get(['delayTime'], (result) => {
  document.getElementById('delayTime').value = result.delayTime || 500;
});

// Save delay time to storage
document.getElementById('save').addEventListener('click', () => {
  let delayTime = document.getElementById('delayTime').value;
  chrome.storage.sync.set({delayTime: delayTime}, () => {
    alert('Settings saved.');
  });
});