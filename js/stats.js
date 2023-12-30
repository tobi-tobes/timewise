// stats.js
// Script file for the functionality of the stats dashboard

$(document).ready(function() {
  // ALL-TIME STATS SECTION FUNCTIONALITY
  const totalSessions = document.querySelector('.total-sessions .time');
  const totalTime = document.querySelector('.total-time .time');
  const totalBreakTime = document.querySelector('.total-break-time .time');
  const avgSessionLength = document.querySelector('.avg-session-length .time');

  // Listen for messages from the extension
  window.addEventListener('message', function(event) {
    if (event.data.type === 'sendDataToDashboard') {
      console.log(event.data.data);
    }
  });

  // Update stats dashboard with total time
  let totalTimeSpent = localStorage.getItem('totalTimeSpent') || 0;
  if (totalTimeSpent < 60) {
    totalTime.textContent = `${totalTimeSpent} mins`;
  } else if (totalTimeSpent === 60) {
    totalTime.textContent = '1 h';
  } else {
    const minutes = totalTimeSpent % 60;
    const hours = Math.floor(totalTimeSpent / 60);
    totalTime.textContent = `${hours} h ${minutes} mins`;
  }

  // Update stats dashboard with total number of sessions
  let totalSessionsCount = localStorage.getItem('totalSessions') || 0;
  totalSessions.textContent = `${totalSessionsCount}`;

  // Update stats dashboard with total break time taken
  let totalBreakTimeSpent = localStorage.getItem('totalBreakTime') || 0;
  const totalBreakTimeSpentInMins = Math.ceil(totalBreakTimeSpent / (1000 * 60));
  if (totalBreakTimeSpentInMins < 60) {
    totalBreakTime.textContent = `${totalBreakTimeSpentInMins} mins`;
  } else if (totalBreakTimeSpentInMins === 60) {
    totalBreakTime.textContent = '1 h';
  } else {
    const minutes = totalBreakTimeSpentInMins % 60;
    const hours = Math.floor(totalBreakTimeSpentInMins / 60);
    totalBreakTime.textContent = `${hours} h ${minutes} mins`;
  }

  // Update stats dashboard with average session length
  if (totalSessionsCount == 0) {
    avgSessionLength.textContent = '0 mins';
  } else {
    const average = totalTimeSpent / totalSessionsCount;
    if (average < 60) {
      avgSessionLength.textContent = `${average} mins`;
    } else if (average === 60) {
      avgSessionLength.textContent = '1 h';
    } else {
      const minutes = average % 60;
      const hours = Math.floor(average / 60);
      avgSessionLength.textContent = `${hours} h ${minutes} mins`;
    }
  }

  // DAILY STATS FUNCTIONALITY
  // Get current date to display on dashboard
  document.querySelector('.today-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Display total working minutes for current date
  const todayDate = new Date();

  const todayData = getDailyData(todayDate);

  if (todayData) {
    document.querySelector('.today-stats p span.time').innerText = `${todayData.focusedWorkMinutes} mins`;
  } else {
    document.querySelector('.today-stats p span.time').innerText = `0 mins`;
  }

  // Get all td elements (days) within the calendar
  const days = document.querySelectorAll('.dycalendar-body td');

  days.forEach(day => {
    day.addEventListener('click', function() {
        // Handle display of data for each day

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
        const dailyData = getDailyData(selectedDate);

        if (dailyData) {
          document.querySelector('.today-stats p span.time').innerText = `${currentData.focusedWorkMinutes} mins`;
        } else {
          document.querySelector('.today-stats p span.time').innerText = `0 mins`;
        }

        // Display selected date on dashboard
        document.querySelector('.today-date').innerText = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    });
  });
});
