// content-script.js
// Allows extension to communicate with stats dashboard

// Send data from chrome.storage.local to dashboard
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'sendDataToDashboard') {
      // Do something with the data received from the extension
      console.log('Received data from the extension:', request.data);
    }
});
