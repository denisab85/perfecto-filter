  let searchTermInput = document.getElementById('searchTermInput');

  chrome.storage.sync.get('searchTerm', function(data) {
    searchTermInput.value = data.searchTerm;
    searchTermInput.setAttribute('value', data.searchTerm);
  });

  const doSearch = () => {
    let searchTerm = searchTermInput.value;
	chrome.storage.sync.set({searchTerm: searchTerm}, ()=>{});  
	// Send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
	});
  }
  
  var timeoutId = 0;
  
  searchTermInput.onkeydown = (element) => {
	if (timeoutId != 0) {
      clearTimeout(timeoutId);
	}
	timeoutId = setTimeout(() => {
      doSearch();
    }, 500);
  }
