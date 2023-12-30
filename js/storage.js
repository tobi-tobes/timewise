// Storage.js - HELPER FUNCTIONS AND VARIABLES FOR DATA COLLECTION FOR STATS

// Function to format a date as "YYYY-MM-DD"
export function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get data for a specific date
export function getDailyData(date) {
  const formattedDate = formatDate(date);
  chrome.storage.local.get(formattedDate, (result) => {
    callback(result[formattedDate] || null);
  });
}

// Function to store daily data
export function storeDailyData(minutes) {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  
  getDailyData(currentDate, (currentData) => {
    currentData = currentData || {};
    currentData.focusedWorkMinutes = (currentData.focusedWorkMinutes || 0) + minutes;

    // Update the storageData object
    const dataToUpdate = {};
    dataToUpdate[formattedDate] = currentData;
    chrome.storage.local.set(dataToUpdate);
  });
}

// Function to get total time spent for a specific date
export function getTotalTimeSpent(date) {
  const formattedDate = formatDate(date);
  chrome.storage.local.get(formattedDate, (result) => {
    callback(result[formattedDate] || null);
  });
}

// Function to keep track of total time spent on extension
export function updateTotalTimeSpent(minutes) {
  // Retrieve the existing total time from storage
  chrome.storage.local.get('totalTimeSpent', function(data) {
    let totalMinutes = data.totalTimeSpent || 0;

    // Update the total time
    totalMinutes = parseInt(totalMinutes) + minutes;

    // Save the updated total time back to storage
    chrome.storage.local.set({'totalTimeSpent': totalMinutes});
  });
}

// Function to keep track of total number of sessions
export function updateTotalSessions() {
  // Retrieve the existing total number of sessions from storage
  chrome.storage.local.get('totalSessions', function(data) {
    let totalSessions = data.totalSessions || 0;

    // Update the total number of sessions
    totalSessions = parseInt(totalSessions) + 1;

    // Save the updated total number of sessions back to storage
    chrome.storage.local.set({'totalSessions': totalSessions});
  });
}

// Function to keep track of total break time taken on extension
export function updateTotalBreakTime(minutes) {
  // Retrieve the existing total break time from storage
  chrome.storage.local.get('totalBreakTime', function(data) {
    let totalMinutes = data.totalBreakTime || 0;

    // Update the total break time
    totalMinutes = parseInt(totalMinutes) + minutes;

    // Save the updated total break time back to storage
    chrome.storage.local.set({'totalBreakTime': totalMinutes});
  });
}
