// stats.js
// Script file for the functionality of the stats dashboard

$(document).ready(function() {
  // DAILY STATS FUNCTIONALITY
  // Get current date to display on dashboard
  document.querySelector('.today-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // DAILY GOAL MODAL FUNCTIONALITY
  const cancelBtn = document.querySelector('.cancel-btn');
  const dailyGoalCreator = document.querySelector('.daily-goal-creator');
  const editBtn = document.querySelector('.edit-daily-goal');

  // Open daily goal creator
  editBtn.addEventListener('click', () => {
    dailyGoalCreator.classList.remove('hidden');
  });

  // Close daily goal creator
  cancelBtn.addEventListener('click', () => {
    dailyGoalCreator.classList.add('hidden');
  });

  // Functionality to switch between calendar and weekly view
  const weeklyViewBtn = document.querySelector('.calendar-view .view-btn');
  const calendarViewBtn = document.querySelector('.weekly .view-btn');
  const calendarView = document.querySelector('.calendar-view');
  const weeklyView = document.querySelector('.weekly');

  calendarViewBtn.addEventListener('click', () => {
    calendarView.classList.remove('hidden');
    weeklyView.classList.add('hidden');
  });

  weeklyViewBtn.addEventListener('click', () => {
    calendarView.classList.add('hidden');
    weeklyView.classList.remove('hidden');
  });

  // Functionality to draw chart

  // Receive weekly data from content script
  window.addEventListener('message', function(event) {
    if (event.source === window && event.data.action === 'drawChart') {
      console.log('Received data:', event.data.data);
      const pastWeekArray = event.data.data.labels;
      const weekWorkingHours = event.data.data.workingHours;

      console.log(pastWeekArray);
      console.log(weekWorkingHours);

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
    }
  });
});
