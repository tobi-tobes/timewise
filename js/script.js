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

  // Show Strict mode tooltip if strict mode is toggled
  const strictModeToolTip = document.querySelector('.appear-when-strict-mode-toggled');
  strictModeCheckbox.addEventListener('change', () => {
    // Check the state of the strict mode checkbox
    const isStrictMode = strictModeCheckbox.checked;

    // Show tooltip depending on whether strict mode has been toggled on or off
    if (isStrictMode) {
      strictModeToolTip.classList.remove('hidden');
    } else {
      strictModeToolTip.classList.add('hidden');
    }
  });

   // Countdown timer functionality
   const timerDigital = document.querySelector('.timer-digital');
   let timeRemaining;

   function startCountdownTimer(durationInSeconds) {
    timeRemaining = durationInSeconds;

    // Update the timer display initially
    updateTimerDisplay();

    // Start the countdown interval
    const countdownInterval = setInterval(() => {
      timeRemaining--;

      // Update the timer display
      updateTimerDisplay();

      // Check if the countdown has reached zero
      if (timeRemaining <= 0) {
        // Stop the countdown interval
        clearInterval(countdownInterval);

        // Perform actions when the timer reaches zero (e.g., show a modal)
        timerReachedZeroActions();
      }
    }, 1000);
  }

  // Function to update the timer display
  function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    // Display the time in the desired format (adjust as needed)
    timerDigital.textContent = `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
  }

  // Function to format time component (e.g., add leading zero)
  function formatTimeComponent(timeComponent) {
    return timeComponent < 10 ? `0${timeComponent}` : timeComponent;
  }

  // Function to perform actions when the timer reaches zero
  function timerReachedZeroActions() {
    // Add your actions here (e.g., show a modal, play a sound, etc.)
    console.log('Timer reached zero!');

    // For demonstration purposes, showing a modal after the timer reaches zero
    alert('Timer reached zero!');
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

    startCountdownTimer(durationInSeconds);
  });

  // Site black-list functionality
  const siteBlacklistTextarea = document.getElementById('site-blacklist');

  function updateSiteBlacklist() {
    // Parse the site blacklist textarea input into an array
    const siteBlacklist = siteBlacklistTextarea.value.split(',').map(site => site.trim());

    // Use the 'siteBlacklist' array as needed, for example:
    console.log('Site Blacklist:', siteBlacklist);
  }

  siteBlacklistTextarea.addEventListener('input', () => {
    // Update the site blacklist array
    updateSiteBlacklist();
  });
});
