// content-script.js
// Allows extension to communicate with stats dashboard

// Send data from chrome.storage.local to dashboard
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
    const hours = Math.floor(totalTimeSpent / 60);
    totalTime.textContent = `${hours} h ${minutes} mins`;
  }

  // Update stats dashboard with total break time taken
  const totalBreakTime = document.querySelector('.total-break-time .time');
  let totalBreakTimeSpent = data.totalBreakTime || 0;
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
  const avgSessionLength = document.querySelector('.avg-session-length .time');
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
});
