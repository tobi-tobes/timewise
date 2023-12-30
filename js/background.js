// background.js

// HELPER FUNCTIONS
// Function to keep track of total break time taken on extension
function updateTotalBreakTime(minutes) {
  // Retrieve the existing total break time from storage
  chrome.storage.local.get('totalBreakTime', function(data) {
    let totalMinutes = data.totalBreakTime || 0;

    // Update the total break time
    totalMinutes = parseInt(totalMinutes) + minutes;

    // Save the updated total break time back to storage
    chrome.storage.local.set({'totalBreakTime': totalMinutes});
  });
}

// Function to keep track of total time spent on extension
function updateTotalTimeSpent(minutes) {
  // Retrieve the existing total time from storage
  chrome.storage.local.get('totalTimeSpent', function(data) {
    let totalMinutes = data.totalTimeSpent || 0;

    // Update the total time
    totalMinutes = parseInt(totalMinutes) + minutes;

    // Save the updated total time back to storage
    chrome.storage.local.set({'totalTimeSpent': totalMinutes});
  });
}

// Open extension in its own tab for better persistence
chrome.action.onClicked.addListener(async () => {
  await chrome.tabs.create({ url: chrome.runtime.getURL("components/main.html") });
});

// COUNTDOWN TIMER FUNCTIONALITY
// Initialize timer state
const timerState = {
  isRunning: false,
  isPaused: false,
  timeRemaining: 0,
};

let countdownInterval;

// Function to update the timer display
function updateTimerDisplay() {
  const hours = Math.floor(timerState.timeRemaining / 3600);
  const minutes = Math.floor((timerState.timeRemaining % 3600) / 60);
  const seconds = timerState.timeRemaining % 60;

  // Send message to pop-up script to display the time in hours, minutes, and seconds
  chrome.runtime.sendMessage({ action: 'updateTimerUI', currentTime: { hours, minutes, seconds } });
}

// Function controlling countdown timer
function startCountdownTimer(durationInSeconds) {
  timerState.timeRemaining = durationInSeconds;

  // Update the timer display initially
  updateTimerDisplay();

  // Start the countdown interval
  countdownInterval = setInterval(() => {
    if (!timerState.isPaused) {
      timerState.timeRemaining--;

      // Update the timer display
      updateTimerDisplay();

      // Check if the countdown has reached zero
      if (timerState.timeRemaining <= 0) {
        // Stop the countdown interval
        clearInterval(countdownInterval);
        chrome.storage.local.get('blockedSites', function (result) {
          const blockedSites = result.blockedSites || [];
          unSetDeclarativeNetRequestRules(blockedSites);
        });
        chrome.runtime.sendMessage({ action: 'timerDone' });
      }
    }
  }, 1000);
}

// Variable to keep track of break time taken
let breakStartTime;

// Listen for messages from pop-up script to start, pause, play, or end timer
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  timerState.isRunning = request.timerState.isRunning;
  timerState.isPaused = request.timerState.isPaused;
  switch (request.action) {
    // Handle timer starting
    case 'startTimer':
      // Retrieve blocked sites array from storage
      chrome.storage.local.get('blockedSites', function (result) {
        const blockedSites = result.blockedSites || [];
        setDeclarativeNetRequestRules(blockedSites);
      });
      startCountdownTimer(request.timerState.timeRemaining);
      break;
    // Handle timer pausing
    case 'pauseTimer':
      breakStartTime = Date.now();
      chrome.storage.local.get('blockedSites', function (result) {
        const blockedSites = result.blockedSites || [];
        unSetDeclarativeNetRequestRules(blockedSites);
      });
      clearInterval(countdownInterval);
      break;
    // Handle timer resuming
    case 'resumeTimer':
      updateTotalBreakTime(Date.now() - breakStartTime);
      breakStartTime = 0;
      chrome.storage.local.get('blockedSites', function (result) {
        const blockedSites = result.blockedSites || [];
        setDeclarativeNetRequestRules(blockedSites);
      });
      startCountdownTimer(timerState.timeRemaining);
      break;
    // Handle timer ending prematurely with end button
    case 'endTimer':
      clearInterval(countdownInterval);
      chrome.storage.local.get('blockedSites', function (result) {
        const blockedSites = result.blockedSites || [];
        unSetDeclarativeNetRequestRules(blockedSites);
      });
      updateTotalTimeSpent(Math.ceil((request.timerState.timeRemaining - timerState.timeRemaining) / 60));
      // Send message to main.js with time spent for daily stats
      chrome.runtime.sendMessage({ action: 'saveUnfinishedTime', unfinishedTime: Math.ceil((request.timerState.timeRemaining - timerState.timeRemaining) / 60)});
      break;
    default:
      break;
  }
});
  
// Function to set up blocking rules for declarativeNetRequest
function setDeclarativeNetRequestRules(blockedSites) {
  // Set up rules for declarativeNetRequest
  blockedSites.forEach((domain, index) => {
    let id = index + 1;
  
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        "id": id,
        "priority": 1,
        "action": { "type": "block" },
        "condition": { "urlFilter": domain, "resourceTypes": ["main_frame"] }
      }],
      removeRuleIds: [id]
    });
  });
}

// Function to remove blocking rules for declarativeNetRequest
function unSetDeclarativeNetRequestRules(blockedSites) {
  // Set up rules for declarativeNetRequest
  blockedSites.forEach((domain, index) => {
    let id = index + 1;
  
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        "id": id,
        "priority": 1,
        "action": { "type": "allow" },
        "condition": { "urlFilter": domain, "resourceTypes": ["main_frame"] }
      }],
      removeRuleIds: [id]
    });
  });
}
