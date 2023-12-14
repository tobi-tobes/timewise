$(document).ready(function() {
  // HEADER FUNCTIONALITY

  // Stats button and modal
  const statsBtn = document.querySelector('.stats-btn');
  const statsModal = document.getElementById('stats-modal');

  statsBtn.addEventListener('click', () => {
    // Reveal stats modal when 'STATS' button on the header is clicked
    statsModal.classList.toggle('hidden');
  });

  const statsDoneBtn = document.querySelector('#stats-modal .modal-btn');
  statsDoneBtn.addEventListener('click', () => {
    // Close stats modal when the 'DONE' button is clicked
    statsModal.classList.add('hidden');
  })


  // HOME PAGE FUNCTIONALITY

  // Pre-set timers selection
  const homePage = document.querySelector('.homepage');
  const timerConfigPage = document.querySelector('.time-config');
  const presetTimers = document.querySelectorAll('.preset-timer');
  const customTimerBtn = document.querySelector('.custom-timer-btn');
  const customTimerModal = document.getElementById('custom-timer-modal');
  const timerConfigStartBtn = document.querySelector('.timer-config-buttons .start-btn');
  let selectedTime;

  presetTimers.forEach((presetTimer) => {
    // Reveal the timer configuration page when any of the pre-set timers are clicked
    presetTimer.addEventListener('click', () => {
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

  customTimerSelectBtn.addEventListener('click', () => {
    // Close custom timer modal when the 'BACK' button is clicked
    customTimerModal.classList.add('hidden');

    // Hide the home page
    homePage.classList.add('hidden');

    // Reveal the timer configuration page
    timerConfigPage.classList.remove('hidden');
  });

  customTimerBackBtn.addEventListener('click', () => {
    // Close stats modal when the 'DONE' button is clicked
    customTimerModal.classList.add('hidden');
  });


  // TIMER CONFIGURATION PAGE FUNCTIONALITY

  const timerConfigBackBtn = document.querySelector('.timer-config-buttons .back-btn');
  const activeTimerStrict = document.querySelector('.active-timer.strict');
  const activeTimerNonStrict = document.querySelector('.active-timer.non-strict');
  const strictModeCheckbox = document.getElementById('strict-mode-toggle-cb');

  // Return to home page when BACK button is clicked
  timerConfigBackBtn.addEventListener('click', () => {
    // Reveal the timer configuration page
    timerConfigPage.classList.add('hidden');

    // Hide the home page
    homePage.classList.remove('hidden');
  });

  const strictModeToolTip = document.querySelector('.appear-when-strict-mode-toggled');
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
    chrome.storage.sync.set({ 'blockedSites': blockedSites });
  }

  siteBlacklistTextarea.addEventListener('input', () => {
    // Update the site blacklist array
    updateSiteBlacklist();
  });

  // NON-STRICT ACTIVE TIMER FUNCTIONALITY
  const pauseBtn = document.querySelector('.pause-symbol');
  const playBtn = document.querySelector('.play-symbol');
  const endBtn = document.querySelector('.end-btn');
  const endTimerModal = document.getElementById('end-clicked-modal');
  let isPaused = false;
  let countdownInterval;

  // Pause button functionality
  pauseBtn.addEventListener('click', () => {
    isPaused = true;
    pauseBtn.classList.add('hidden');
    playBtn.classList.remove('hidden');
    clearInterval(countdownInterval);
  });

  // Play button functionality
  playBtn.addEventListener('click', () => {
    isPaused = false;
    pauseBtn.classList.remove('hidden');
    playBtn.classList.add('hidden');
    startCountdownTimer(timeRemaining);
  });

  // End button functionality
  endBtn.addEventListener('click', () => {
    isPaused = true;
    clearInterval(countdownInterval);
    endTimerModal.classList.remove('hidden');
  });

  // End timer modal functionality
  const yesBtn = document.querySelector('.yes-btn');
  const noBtn = document.querySelector('.no-btn');

  yesBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    endTimerModal.classList.add('hidden');
    activeTimerNonStrict.classList.add('hidden');
    homePage.classList.remove('hidden');
  });

  noBtn.addEventListener('click', () => {
    isPaused = false;
    endTimerModal.classList.add('hidden');
    startCountdownTimer(timeRemaining);
  });

  // Countdown timer functionality
  // Retrieve digital timer based on if strict mode is toggled
  let timerDigital;
  const isStrictMode = strictModeCheckbox.checked;

  if (isStrictMode) {
    timerDigital = document.getElementById('strict-timer');
  } else {
    timerDigital = document.getElementById('non-strict-timer');
  }
  
  let timeRemaining;
  const timerDoneModal = document.getElementById('timer-done-modal');

  function startCountdownTimer(durationInSeconds) {
    timeRemaining = durationInSeconds;

    // Update the timer display initially
    updateTimerDisplay();

    // Start the countdown interval
    countdownInterval = setInterval(() => {
      if (!isPaused) {
        timeRemaining--;

        // Update the timer display
        updateTimerDisplay();

        // Check if the countdown has reached zero
        if (timeRemaining <= 0) {
          // Stop the countdown interval
          clearInterval(countdownInterval);

          // Show timer done modal when timer is done running
          timerDoneModal.classList.remove('hidden');
        }
      }
    }, 1000);
  }

  // Function to update the timer display
  function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    // Display the time in hours, minutes, and seconds
    timerDigital.textContent = `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
  }

  // Function to format time component
  function formatTimeComponent(timeComponent) {
    return timeComponent < 10 ? `0${timeComponent}` : timeComponent;
  }

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

    const durationInSeconds = selectedTime * 60;

    startCountdownTimer(selectedTime);
  });


  // TIMER DONE MODAL FUNCTIONALITY
  const timerDoneEndBtn = document.querySelector('#timer-done-modal .modal-btn');
  timerDoneEndBtn.addEventListener('click', () => {
    timerDoneModal.classList.add('hidden');
    activeTimerNonStrict.classList.add('hidden');
    homePage.classList.remove('hidden');
  });
});
