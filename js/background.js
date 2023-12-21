// background.js

// Check the manifest version
if (chrome.runtime.getManifest().manifest_version === 3) {
    // For manifest version 3 and above
    chrome.storage.local.get('blockedSites', function (result) {
      const blockedSites = result.blockedSites || [];
      setDeclarativeNetRequestRules(blockedSites);
    });
  } else {
    // For manifest version 2
    chrome.storage.sync.get('blockedSites', function (result) {
      const blockedSites = result.blockedSites || [];
      setDeclarativeNetRequestRules(blockedSites);
    });
  }
  
  // Function to set up rules for declarativeNetRequest
  function setDeclarativeNetRequestRules(blockedSites) {
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
  }
  