// main.js
// Main script file for the functionality of the extension

// HELPER FUNCTIONS AND VARIABLES

// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to store daily data
function storeDailyData(minutes) {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  
  chrome.storage.local.get('dailyStorage', (result) => {
    const storage = result.dailyStorage || {};
    storage[formattedDate] = (storage[formattedDate] || 0) + minutes;

    // Save the updated total time for the day back to storage
    chrome.storage.local.set({'dailyStorage': storage});
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

// Function to keep track of total number of sessions
function updateTotalSessions() {
  // Retrieve the existing total number of sessions from storage
  chrome.storage.local.get('totalSessions', function(data) {
    let totalSessions = data.totalSessions || 0;

    // Update the total number of sessions
    totalSessions = parseInt(totalSessions) + 1;

    // Save the updated total number of sessions back to storage
    chrome.storage.local.set({'totalSessions': totalSessions});
  });
}

$(document).ready(function() {
  // HOME PAGE FUNCTIONALITY

  // Pre-set timers selection
  const homePage = document.querySelector('.homepage');
  const timerConfigPage = document.querySelector('.time-config');
  const presetTimers = document.querySelectorAll('.preset-timer');
  const customTimerBtn = document.querySelector('.custom-timer-btn');
  const customTimerModal = document.getElementById('custom-timer-modal');
  const timerConfigStartBtn = document.querySelector('.timer-config-buttons .start-btn');
  const strictModeCheckbox = document.getElementById('strict-mode-toggle-cb');
  const strictModeToolTip = document.querySelector('.appear-when-strict-mode-toggled');
  let selectedTime;

  presetTimers.forEach((presetTimer) => {
    // Reveal the timer configuration page when any of the pre-set timers are clicked
    presetTimer.addEventListener('click', () => {
      // Make sure strict mode is unchecked at the start of each configuration
      strictModeCheckbox.checked = false;
      strictModeToolTip.classList.add('hidden');

      // Store timer duration in variable for future use
      const time = presetTimer.classList[0];
      const duration = presetTimer.classList[1].replaceAll('-', ' ');
      selectedTime = parseInt(time, 10);

      // Hide the home page
      homePage.classList.add('hidden');
      
      // Reveal the timer configuration page
      timerConfigPage.classList.remove('hidden');

      // Put selected duration in start button
      timerConfigStartBtn.textContent = `Start your session (${duration})`;
    });
  });

  customTimerBtn.addEventListener('click', () => {
    // Close stats modal when the 'DONE' button is clicked
    customTimerModal.classList.remove('hidden');
  });

  // Custom timer modal functionality
  const customTimerSelectBtn = document.querySelector('.custom-timer-buttons .select-btn');
  const customTimerBackBtn = document.querySelector('.custom-timer-buttons .back-btn');

  customTimerBackBtn.addEventListener('click', () => {
    // Close custom timer modal when the 'DONE' button is clicked
    customTimerModal.classList.add('hidden');
  });

  // TIMER CONFIGURATION PAGE FUNCTIONALITY

  const timerConfigBackBtn = document.querySelector('.timer-config-buttons .back-btn');
  const activeTimerStrict = document.querySelector('.active-timer.strict');
  const activeTimerNonStrict = document.querySelector('.active-timer.non-strict');

  // Return to home page when BACK button is clicked
  timerConfigBackBtn.addEventListener('click', () => {
    // Reveal the timer configuration page
    timerConfigPage.classList.add('hidden');

    // Hide the home page
    homePage.classList.remove('hidden');
  });

  strictModeCheckbox.addEventListener('change', () => {
    // Check the state of the strict mode checkbox
    const isStrictMode = strictModeCheckbox.checked;

    // Show tooltip depending on whether strict mode has been toggled on or off
    if (isStrictMode) {
      strictModeToolTip.classList.remove('hidden');
      timerDigital = document.getElementById('strict-timer');
    } else {
      strictModeToolTip.classList.add('hidden');
      timerDigital = document.getElementById('non-strict-timer');
    }
  });

  // Site black-list functionality
  const siteBlacklistTextarea = document.getElementById('site-blacklist');
  let blockedSites = [];

  function updateSiteBlacklist() {
    // Parse the site blacklist textarea input into blockedSites array
    blockedSites = siteBlacklistTextarea.value.split(',').map(site => site.trim());

    // Save the updated blockedSites array to chrome.storage
    chrome.storage.local.set({ 'blockedSites': blockedSites });
  }

  // Make sure textarea is cleared every time before new session
  siteBlacklistTextarea.value = '';

  siteBlacklistTextarea.addEventListener('input', () => {
    // Update the site blacklist array
    updateSiteBlacklist();
  });

  // NON-STRICT ACTIVE TIMER FUNCTIONALITY
  const pauseBtn = document.querySelector('.pause-symbol');
  const playBtn = document.querySelector('.play-symbol');
  const endBtn = document.querySelector('.end-btn');
  const endTimerModal = document.getElementById('end-clicked-modal');
  let durationInSeconds;

  // Pause button functionality
  pauseBtn.addEventListener('click', () => {
    pauseBtn.classList.add('hidden');
    playBtn.classList.remove('hidden');
    chrome.runtime.sendMessage({ action: 'pauseTimer', timerState: { isRunning: true, isPaused: true } });
  });

  // Play button functionality
  playBtn.addEventListener('click', () => {
    pauseBtn.classList.remove('hidden');
    playBtn.classList.add('hidden');
    chrome.runtime.sendMessage({ action: 'resumeTimer', timerState: { isRunning: true, isPaused: false } });
  });

  // End button functionality
  endBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'pauseTimer', timerState: { isRunning: true, isPaused: true } });
    endTimerModal.classList.remove('hidden');
  });

  // End timer modal functionality
  const yesBtn = document.querySelector('.yes-btn');
  const noBtn = document.querySelector('.no-btn');

  yesBtn.addEventListener('click', () => {
    endTimerModal.classList.add('hidden');
    activeTimerNonStrict.classList.add('hidden');
    chrome.runtime.sendMessage({ action: 'endTimer', timerState: { isRunning: false, isPaused: false, timeRemaining: durationInSeconds } });
    homePage.classList.remove('hidden');
  });

  noBtn.addEventListener('click', () => {
    endTimerModal.classList.add('hidden');
    chrome.runtime.sendMessage({ action: 'resumeTimer', timerState: { isRunning: true, isPaused: false } });
  });

  // Countdown timer functionality
  // Retrieve digital timer div from HTML based on if strict mode is toggled
  let timerDigital;
  const isStrictMode = strictModeCheckbox.checked;

  if (isStrictMode) {
    timerDigital = document.getElementById('strict-timer');
  } else {
    timerDigital = document.getElementById('non-strict-timer');
  }

  const timerDoneModal = document.getElementById('timer-done-modal');

  // Function to format time component
  function formatTimeComponent(timeComponent) {
    return timeComponent < 10 ? `0${timeComponent}` : timeComponent;
  }

  function updateTimerUI(hours, minutes, seconds) {
    // Display the time in hours, minutes, and seconds
    timerDigital.textContent = `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
  }

  // Listener for messages from background.js to update timer UI or show timerDoneModal
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimerUI') {
      // Update the UI based on the received timer state
      updateTimerUI(request.currentTime.hours, request.currentTime.minutes, request.currentTime.seconds);
    } else if (request.action === 'timerDone') {
      // Show timer done modal when timer is done running
      timerDoneModal.classList.remove('hidden');
      // Save finished time to storage
      updateTotalTimeSpent(Math.ceil((durationInSeconds) / 60));
      // Update number of sessions
      updateTotalSessions();
      // Save finished time to daily data
      storeDailyData(Math.ceil((durationInSeconds) / 60));
    } else if (request.action === 'saveUnfinishedTime') {
      storeDailyData(request.unfinishedTime);
    }
  });

  // Start timer when 'Start session' button is clicked
  timerConfigStartBtn.addEventListener('click', () => {
    timerConfigPage.classList.add('hidden');

    // Check if 'Strict mode' is toggled on
    const isStrictMode = strictModeCheckbox.checked;

    if (isStrictMode) {
      activeTimerStrict.classList.remove('hidden');
    } else {
      activeTimerNonStrict.classList.remove('hidden');
    }

    durationInSeconds = selectedTime * 60;

    chrome.runtime.sendMessage({ action: 'startTimer', timerState: { isRunning: true, isPaused: false, timeRemaining: durationInSeconds } });
  });


  // TIMER DONE MODAL FUNCTIONALITY
  const timerDoneEndBtn = document.querySelector('#timer-done-modal .modal-btn');
  timerDoneEndBtn.addEventListener('click', () => {
    timerDoneModal.classList.add('hidden');
    activeTimerNonStrict.classList.add('hidden');
    activeTimerStrict.classList.add('hidden');
    homePage.classList.remove('hidden');
  });


  // STRICT ACTIVE TIMER FUNCTIONALITY
  const strictTimerPause = document.querySelector('.active-timer.strict .timer-outer .timer-inner');
  const wordsOfAffirmationArray = ['You can do it!', "Don't give up!", "Don't stop now!", "Believe in yourself!", "Every small step counts!", "You're not a quitter!"];
  const wordsOfAffirmation = document.querySelector('.words-of-affirmation');

  strictTimerPause.addEventListener('click', () => {
    const randomIdx = Math.floor(Math.random() * wordsOfAffirmationArray.length);
    wordsOfAffirmation.textContent = wordsOfAffirmationArray[randomIdx];
  });

  // CUSTOM TIMER MODAL FUNCTIONALITY
  const minutePicker = document.querySelector('.minute-select');
  const hourPicker = document.querySelector('.hour-select');

  // Create options for minute select
  for(let i = 0; i < 60; i++) {
    const minuteOptionValue = i < 10 ? `0${i}` : `${i}`;
    const minuteOption = `<option value="${i}">${minuteOptionValue}</option>`;
    minutePicker.innerHTML += minuteOption;
  }

  // Create options for hour select
  for(let i = 0; i < 100; i++) {
    const hourOptionValue = i < 10 ? `0${i}` : `${i}`;
    const hourOption = `<option value="${i * 60}">${hourOptionValue}</option>`;
    hourPicker.innerHTML += hourOption;
  }

   // Function to update selectedTime based on user selection
   function updateSelectedTime() {
    const selectedHour = parseInt(hourPicker.value, 10) || 0; // Convert to integer, default to 0 if not a valid number
    const selectedMinute = parseInt(minutePicker.value, 10) || 0; // Convert to integer, default to 0 if not a valid number
    selectedTime = selectedHour + selectedMinute;
  }

  // Event listener for minute select
  minutePicker.addEventListener('change', updateSelectedTime);

  // Event listener for hour select
  hourPicker.addEventListener('change', updateSelectedTime);

  customTimerSelectBtn.addEventListener('click', () => {
    // Close custom timer modal when the 'BACK' button is clicked
    customTimerModal.classList.add('hidden');

    // Hide the home page
    homePage.classList.add('hidden');

    // Reveal the timer configuration page
    timerConfigPage.classList.remove('hidden');
    timerConfigStartBtn.textContent = `Start your session (${selectedTime} mins)`;
  });
});
