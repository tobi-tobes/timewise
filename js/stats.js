// stats.js
// Script file for the functionality of the stats dashboard

$(document).ready(function() {
  // ALL-TIME STATS SECTION FUNCTIONALITY

  // Listen for messages from the extension
  window.addEventListener('message', function(event) {
    if (event.data.type === 'sendDataToDashboard') {
      console.log(event.data.data);
    }
  });

  // DAILY STATS FUNCTIONALITY
  // Get current date to display on dashboard
  document.querySelector('.today-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Display total working minutes for current date
//   const todayDate = new Date();

//   const todayData = getDailyData(todayDate);

//   if (todayData) {
//     document.querySelector('.today-stats p span.time').innerText = `${todayData.focusedWorkMinutes} mins`;
//   } else {
//     document.querySelector('.today-stats p span.time').innerText = `0 mins`;
//   }

  // Get all td elements (days) within the calendar
  const days = document.querySelectorAll('.dycalendar-body td');

  /* days.forEach(day => {
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
  }); */
});
