  let searchTermInput = document.getElementById('searchTermInput');

  chrome.storage.sync.get('searchTerm', function(data) {
    searchTermInput.value = data.searchTerm;
    searchTermInput.setAttribute('value', data.searchTerm);
  });
  
  const doSearch = () => {
    let searchTerm = searchTermInput.value;
    chrome.storage.sync.set({searchTerm: searchTerm}, ()=>{});  
    // Reset style
    let xpath = '"//div[starts-with(@class,\'JobsList__row\') '
    		+ 'and (contains(@style, \'display\'))]"';
    let evaluate = 'document.evaluate(' + xpath + ', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue';
    let code = 'var element = ' + evaluate + ';'
    			+ 'while(element) {'
    			+ '  element.style.display = null;'
    			+ '  element = ' + evaluate
    			+ '}';
    // Hide divs not containing the serach term
    xpath = '"//div[starts-with(@class,\'JobsList__row\') and not (contains(@style, \'display\'))]"';
    evaluate = 'document.evaluate(' + xpath + ', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue';
    code += 'searchTerm = "' + searchTerm + '";'
          + 'element = ' + evaluate + ';'
          + 'while(element) {'
          + '  if (element.getAttribute("data-aid").includes(searchTerm)) {' 
          + '    element.style.display = "block";'
          + '  } else {'
          + '    element.style.display = "none";'
          + '  }'
          + '  element = ' + evaluate
          + '}';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	chrome.tabs.executeScript(tabs[0].id, {code: code});
    });
  }
  
  searchTermInput.onkeydown = (element) => {
    doSearch();
  }
