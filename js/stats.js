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
});
