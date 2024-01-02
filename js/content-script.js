// content-script.js
// Allows extension to communicate with stats dashboard

// HELPERS
// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to display focused minutes worked for a selected day
function displayWorkingMinutesForSelectedDay(date) {
  const formattedDate = formatDate(date);

  chrome.storage.local.get('dailyStorage', (result) => {
    const storage = result.dailyStorage || {};
    const dailyData = storage[formattedDate] || 0;

    if (dailyData < 60) {
      document.querySelector('.today-stats p span.time').innerText = `${dailyData} mins`;
    } else if (dailyData === 60) {
      document.querySelector('.today-stats p span.time').innerText = `1 h`;
    } else {
      const minutes = dailyData % 60;
      const hours = Math.round(dailyData / 60);
      document.querySelector('.today-stats p span.time').innerText = `${hours} h ${minutes} mins`;
    }
  });
}

let dailyGoal;
let todayData;

// Function to display daily goal
function displayDailyGoal() {
  chrome.storage.local.get('dailyGoal', (result) => {
    dailyGoal = result.dailyGoal || 0;

    if (dailyGoal < 60) {
      dailyGoalDisplay.innerText = `${dailyGoal} mins`;
    } else if (dailyGoal === 60) {
      dailyGoalDisplay.innerText = `1 h`;
    } else {
      const minutes = dailyGoal % 60;
      const hours = Math.round(dailyGoal / 60);
      dailyGoalDisplay.innerText = `${hours} h ${minutes} mins`;
    }
  });
}

// Function to display focused minutes worked for current day
function displayWorkingMinutesForCurrentDay() {
  const todayDate = new Date();
  const formattedDate = formatDate(todayDate);

  chrome.storage.local.get('dailyStorage', (result) => {
    const storage = result.dailyStorage || {};
    todayData = storage[formattedDate] || 0;

    if (todayData < 60) {
      document.querySelector('.daily-goal-container p').innerText = `${todayData} mins/`;
    } else if (todayData === 60) {
      document.querySelector('.daily-goal-container p').innerText = `1 h/`;
    } else {
      const minutes = todayData % 60;
      const hours = Math.round(todayData / 60);
      document.querySelector('.daily-goal-container p').innerText = `${hours} h ${minutes} mins/`;
    }
  });
}

// Send data from chrome.storage.local to dashboard for ALL-TIME STATS SECTION FUNCTIONALITY
chrome.storage.local.get(['totalBreakTime', 'totalTimeSpent', 'totalSessions'], function(data) {
  console.log(data);

  // Update stats dashboard with total number of sessions
  const totalSessions = document.querySelector('.total-sessions .time');
  let totalSessionsCount = data.totalSessions || 0;
  totalSessions.textContent = totalSessionsCount;

  // Update stats dashboard with total time
  const totalTime = document.querySelector('.total-time .time');
  let totalTimeSpent = data.totalTimeSpent || 0;
  if (totalTimeSpent < 60) {
    totalTime.textContent = `${totalTimeSpent} mins`;
  } else if (totalTimeSpent === 60) {
    totalTime.textContent = '1 h';
  } else {
    const minutes = totalTimeSpent % 60;
    const hours = Math.round(totalTimeSpent / 60);
    totalTime.textContent = `${hours} h ${minutes} mins`;
  }

  // Update stats dashboard with total break time taken
  const totalBreakTime = document.querySelector('.total-break-time .time');
  let totalBreakTimeSpent = data.totalBreakTime || 0;
  const totalBreakTimeSpentInMins = Math.round(totalBreakTimeSpent / (1000 * 60));
  if (totalBreakTimeSpentInMins < 60) {
    totalBreakTime.textContent = `${totalBreakTimeSpentInMins} mins`;
  } else if (totalBreakTimeSpentInMins === 60) {
    totalBreakTime.textContent = '1 h';
  } else {
    const minutes = totalBreakTimeSpentInMins % 60;
    const hours = Math.round(totalBreakTimeSpentInMins / 60);
    totalBreakTime.textContent = `${hours} h ${minutes} mins`;
  }

  // Update stats dashboard with average session length
  const avgSessionLength = document.querySelector('.avg-session-length .time');
  if (totalSessionsCount == 0) {
    avgSessionLength.textContent = '0 mins';
  } else {
    const average = Math.round(totalTimeSpent / totalSessionsCount);
    if (average < 60) {
      avgSessionLength.textContent = `${average} mins`;
    } else if (average === 60) {
      avgSessionLength.textContent = '1 h';
    } else {
      const minutes = average % 60;
      const hours = Math.round(average / 60);
      avgSessionLength.textContent = `${hours} h ${minutes} mins`;
    }
  }
});

// DAILY STATS FUNCTIONALITY
// Display total working minutes for current date
const todayDate = new Date();

displayWorkingMinutesForSelectedDay(todayDate);

// Get all td elements (days) within the calendar to handle clicking of days
const days = document.querySelectorAll('.dycalendar-body td');

days.forEach(day => {
  day.addEventListener('click', function() {
    // Handle display of data for each day
    console.log(`${day} clicked`);

    // Retrieve date from HTML elements to use to generate Date object
    const clickedDay = day.innerHTML;
    const monthYearString = document.querySelector('.dycalendar-span-month-year').innerHTML;

    // Split the month and year string into an array of [month, year]
    const [month, year] = monthYearString.split(' ');

    // Convert month name to its numerical representation (assuming English month names)
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth();

    // Create a Date object using the extracted day, month, and year
    const selectedDate = new Date(`${year}-${monthIndex + 1}-${clickedDay}`);

    // Use created Date object to retrieve working time from storage
    displayWorkingMinutesForSelectedDay(selectedDate);

    // Display selected date on dashboard
    document.querySelector('.today-date').innerText = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });
});

// DAILY GOAL
// Display current daily goal
const dailyGoalDisplay = document.querySelector('.daily-goal span');
displayWorkingMinutesForCurrentDay();
displayDailyGoal();

// Set daily goal
const dailyGoalForm = document.querySelector('.daily-goal-creator');
const dailyWorkingHoursInput = document.getElementById('daily-working-hours');

dailyGoalForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const dailyWorkingHoursGoal = parseInt(dailyWorkingHoursInput.value, 10);
  chrome.storage.local.set({ 'dailyGoal': dailyWorkingHoursGoal });
  displayDailyGoal();
  dailyGoalForm.classList.add('hidden');
});

// Display amount of hours worked
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCurrentDay') {
    // Update the UI to display working minutes for current day
    displayWorkingMinutesForCurrentDay();
  }
});

// Update UI if daily goal has been reached
const dailyGoalContainer = document.querySelector('.daily-goal');
if (todayData === dailyGoal) {
  dailyGoalContainer.classList.add('goal-reached', 'glowing-border');
} else {
  dailyGoalContainer.classList.remove('goal-reached', 'glowing-border');
}


// WEEKLY STATS FUNCTIONALITY
// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to fetch focused work minutes for the past 6 days before current day
function fetchDataForThePastWeek() {
  // Create array of dates for the week
  const today = new Date();
  let i = 6;
  const weekArray = [];

  while (i >= 0) {
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - i);

    const formattedDate = formatDate(previousDate);
    weekArray.push(formattedDate);

    i--;
  }

  return weekArray;
}

const pastWeekArray = fetchDataForThePastWeek();
const weekWorkingHours = [];

// Use array of formatted dates to fetch data from storage
chrome.storage.local.get('dailyStorage', (result) => {
  const storage = result.dailyStorage || {};
  for (const formattedDate of pastWeekArray) {
    weekWorkingHours.push(storage[formattedDate] || 0);
  }
});

// Ensure document and scripts have fully loaded before creating the bar chart
document.addEventListener("DOMContentLoaded", function() {
  // Create bar chart using Chart.js library
  const ctx = document.getElementById('weekly-chart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pastWeekArray,
      datasets: [{
        label: 'Weekly View',
        data: weekWorkingHours,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
