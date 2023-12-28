// stats.js
// Script file for the functionality of the stats dashboard

$(document).ready(function() {
  // ALL-TIME STATS SECTION FUNCTIONALITY
  const totalSessions = document.querySelector('.total-sessions .time');
  const totalTime = document.querySelector('.total-time .time');
  const totalBreakTime = document.querySelector('.total-break-time .time');
  const avgSessionLength = document.querySelector('.avg-session-length .time');

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
});
