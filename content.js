let delayTime = 500; // default delay time

// Load delay time from storage
chrome.storage.sync.get(['delayTime'], (result) => {
  delayTime = result.delayTime || 500;
});

// Function to insert the 'Unfollow All' button
function insertButton(userListContainer) {
  let btn = document.createElement('button');
  btn.innerText = "Unfollow All";
  btn.id = 'unfollowButton';
  userListContainer.insertBefore(btn, userListContainer.firstChild);

  // Button click event
  btn.addEventListener('click', async () => {
    // Fetch the latest delay time from storage
    let delayTime;
    await chrome.storage.sync.get(['delayTime'], (result) => {
      delayTime = result.delayTime || 500;
    });

    const unfollowButtons = Array.from(document.querySelectorAll('button[data-e2e="follow-button"]'));
    for (let unfollowBtn of unfollowButtons) {
	  await new Promise(resolve => setTimeout(resolve, delayTime)); // Delay after the click
      if (unfollowBtn.innerText === 'Following') {
        unfollowBtn.click();
      }
    }
    // Send message to background.js to show notification
    chrome.runtime.sendMessage({message: "unfollow_complete"});
  });
}

// Rest of your code

// Function to start observing changes in the body element
function startObserver() {
  // Select the node that will be observed for mutations
  let targetNode = document.body;

  // Options for the observer (which mutations to observe)
  let config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  let callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        let userListContainer = document.querySelector('div.tiktok-wq5jjc-DivUserListContainer.eorzdsw0');
        let btn = document.querySelector('#unfollowButton');
        if (userListContainer && !btn) {
          insertButton(userListContainer);
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  let observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// Start the observer when the extension is loaded
startObserver();