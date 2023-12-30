// Storage dictionary for daily stats
const storageData = {};

// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get data for a specific date
function getDailyData(date) {
  const formattedDate = formatDate(date);
  return storageData[formattedDate] || null;
}

// function to store daily data
function storeDailyData(minutes) {
  const currentDate = new Date();
  const currentData = getDailyData(currentDate) || {};
  currentData.focusedWorkMinutes = (currentData.focusedWorkMinutes || 0) + minutes;

  // Update the storageData object
  storageData[formatDate(currentDate)] = currentData;
}
