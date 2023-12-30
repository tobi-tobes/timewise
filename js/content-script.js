// content-script.js
// Allows extension to communicate with stats dashboard

// Send data from chrome.storage.local to dashboard
chrome.storage.local.get(['totalBreakTime', 'totalTimeSpent', 'totalSessions'], function(data) {
  console.log(data);

  const totalSessions = document.querySelector('.total-sessions .time');
  totalSessions.textContent = data.totalSessions;
});
