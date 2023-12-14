// background.js

chrome.runtime.onInstalled.addListener(function () {
  // Get the list of blocked sites from chrome.storage
  chrome.storage.sync.get('blockedSites', function (result) {
    const blockedSites = result.blockedSites || [];

    // Set up rules for declarativeNetRequest
    const rules = blockedSites.map(site => ({
      id: site,
      priority: 1,
      action: {
        type: 'block'
      },
      condition: {
        regexFilter: `.*${site}.*`
      }
    }));

    // Add rules to declarativeNetRequest
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [], addRules: rules });
  });
});
  