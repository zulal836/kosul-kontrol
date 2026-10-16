chrome.action.onClicked.addListener(async tab=>{
 if(!tab.id||!/^https?:/.test(tab.url||''))return;
 await chrome.storage.session.set({targetTabId:tab.id});
 chrome.tabs.create({url:chrome.runtime.getURL('index.html')});
});
