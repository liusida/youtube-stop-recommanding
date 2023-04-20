const doBlock = (badgeText, tabId) => {
  if (badgeText === "SHOW") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const relatedDiv = document.querySelector("#related");
        if (relatedDiv) {
          relatedDiv.style.display = "";
        }
      }
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const relatedDiv = document.querySelector("#related");
        if (relatedDiv) {
          relatedDiv.style.display = "none";
        }
      }
    });
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get("badgeText", (data) => {
    const badgeText = data.badgeText || "SHOW";
    chrome.storage.sync.set({ badgeText });
    chrome.action.setBadgeText({ tabId: tab.id, text: badgeText });
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get("badgeText", (data) => {
    const badgeText = data.badgeText === "----" ? "SHOW" : "----";
    chrome.storage.sync.set({ badgeText });
    chrome.action.setBadgeText({ tabId: tab.id, text: badgeText });
    if (tab.url.includes("youtube.com")) {
      doBlock(badgeText, tab.id);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log(tab.url);
  if (tab.url && tab.url.includes("youtube.com/watch?")) {
    chrome.storage.sync.get("badgeText", (data) => {
      const badgeText = data.badgeText || "SHOW";
      chrome.action.setBadgeText({ tabId: tabId, text: badgeText });
      setTimeout(() => {
        doBlock(badgeText, tabId)
      }, 1000);
    });
  }
});
