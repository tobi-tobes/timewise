// background.js

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
        chrome.runtime.sendMessage({ action: 'timerDone' });
      }
    }
  }, 1000);
}

// Listen for messages from pop-up script to start, pause, play, or end timer
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  timerState.isRunning = request.timerState.isRunning;
  timerState.isPaused = request.timerState.isPaused;
  switch (request.action) {
    case 'startTimer':
      // Retrieve blocked sites array from storage
      chrome.storage.local.get('blockedSites', function (result) {
        const blockedSites = result.blockedSites || [];
        setDeclarativeNetRequestRules(blockedSites);
      });
      startCountdownTimer(request.timerState.timeRemaining);
      break;
    case 'pauseTimer':
      clearInterval(countdownInterval);
      break;
    case 'resumeTimer':
      startCountdownTimer(timerState.timeRemaining);
      break;
    case 'endTimer':
      clearInterval(countdownInterval);
      break;
    default:
      break;
  }
});
  
// Function to set up rules for declarativeNetRequest
function setDeclarativeNetRequestRules(blockedSites) {
  // Set up rules for declarativeNetRequest
  const rules = blockedSites.map(site => ({
    id: site,
    priority: 1,
    action: {
      type: 'block'
    },
    condition: {
      regexFilter: `.*${site}.*`
    }
  }));

  // Add rules to declarativeNetRequest
  chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [], addRules: rules });
}
