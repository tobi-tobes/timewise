$(document).ready(function() {
  // HEADER FUNCTIONALITY

  // Stats button and modal
  const statsBtn = document.querySelector('.stats-btn');
  const statsModal = document.getElementById('stats-modal');

  // Retrieve the total time to be displayed from storage
  const totalMinutes = localStorage.getItem('totalTimeSpent') || 0;

  // Display the total time in the stats modal
  document.querySelector('.today-counter span').textContent = totalMinutes;

  statsBtn.addEventListener('click', () => {
    // Reveal stats modal when 'STATS' button on the header is clicked
    statsModal.classList.toggle('hidden');
  });

  const statsDoneBtn = document.querySelector('#stats-modal .modal-btn');
  statsDoneBtn.addEventListener('click', () => {
    // Close stats modal when the 'DONE' button is clicked
    statsModal.classList.add('hidden');
  })

  // Function to keep track of total time spent on extension for stats modal
  function updateTotalTimeSpent(minutes) {
    // Retrieve the existing total time from storage
    let totalMinutes = localStorage.getItem('totalTimeSpent') || 0;
  
    // Update the total time
    totalMinutes = parseInt(totalMinutes) + minutes;
  
    // Save the updated total time back to storage
    localStorage.setItem('totalTimeSpent', totalMinutes);
  }


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

  siteBlacklistTextarea.addEventListener('input', () => {
    // Update the site blacklist array
    updateSiteBlacklist();
  });

  // NON-STRICT ACTIVE TIMER FUNCTIONALITY
  const pauseBtn = document.querySelector('.pause-symbol');
  const playBtn = document.querySelector('.play-symbol');
  const endBtn = document.querySelector('.end-btn');
  const endTimerModal = document.getElementById('end-clicked-modal');
  let timeRemaining;
  let durationInSeconds;
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
    updateTotalTimeSpent(Math.ceil((durationInSeconds - timeRemaining) / 60));
    homePage.classList.remove('hidden');
  });

  noBtn.addEventListener('click', () => {
    isPaused = false;
    endTimerModal.classList.add('hidden');
    startCountdownTimer(timeRemaining);
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

  // Function controlling countdown timer
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
    isPaused = false;

    // Check if 'Strict mode' is toggled on
    const isStrictMode = strictModeCheckbox.checked;

    if (isStrictMode) {
      activeTimerStrict.classList.remove('hidden');
    } else {
      activeTimerNonStrict.classList.remove('hidden');
    }

    durationInSeconds = selectedTime * 60;

    startCountdownTimer(durationInSeconds);
  });


  // TIMER DONE MODAL FUNCTIONALITY
  const timerDoneEndBtn = document.querySelector('#timer-done-modal .modal-btn');
  timerDoneEndBtn.addEventListener('click', () => {
    timerDoneModal.classList.add('hidden');
    activeTimerNonStrict.classList.add('hidden');
    activeTimerStrict.classList.add('hidden');
    homePage.classList.remove('hidden');
    updateTotalTimeSpent(selectedTime);
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
