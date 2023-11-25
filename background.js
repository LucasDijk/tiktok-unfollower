// Import ExtPay
importScripts('ExtPay.js'); // Or use `import` / `require` if using a bundler

// Initialize ExtPay with your extension id
var extpay = ExtPay('tiktok-unfollower');

// Start ExtPay
extpay.startBackground();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check if the updated URL is a TikTok URL
  if (changeInfo.url && changeInfo.url.includes('https://www.tiktok.com')) {
    // Check user's paid status
    const user = await extpay.getUser().catch(e => {
      console.error('Failed to get user:', e);
      return null;
    });

    // If user paid, inject content script and CSS
    if (user && user.paid) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });

      chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ['styles.css']
      });
    } else {
      // If user didn't pay, open the payment page
      extpay.openPaymentPage().catch(e => console.error('Failed to open payment page:', e));
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "unfollow_complete") {
    chrome.notifications.create({
      title: 'TikTok Unfollower',
      message: 'Successfully unfollowed all accounts.',
      iconUrl: 'icons/icon128.png',
      type: 'basic'
    });
  }
});

// Listen to the onPaid event
extpay.onPaid.addListener(user => {
  console.log('User paid!');
  // You can add more actions here...
});