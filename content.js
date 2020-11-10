chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            chrome.storage.sync.get('searchTerm', function(data) {
                doFilter(document, data.searchTerm);
            });
        }
    }
);

const doFilter=(node, searchTerm)=> {
    if (/https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(location.href)) {
        // Reset style
        let xpath = "//div[starts-with(@class,'JobsList__row') and (contains(@style, 'display'))]";
        while(element = document.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
            element.style.display = null;
        }
        if (searchTerm) {
            // Hide divs not containing the serach term
            xpath = "//div[starts-with(@class,'JobsList__row') and not (contains(@style, 'display'))]";
            while(element = document.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                if (element.getAttribute("data-aid").includes(searchTerm)) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }
            };
        }
    }
}

var observer = new MutationObserver(mutations => {
     if (/https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(location.href)) {
        mutations.forEach((mutation)=>{
            mutation.addedNodes.forEach((addedNode)=>{
                if (addedNode.nodeName === "DIV") {
                    chrome.storage.sync.get('searchTerm', function(data) {
                        doFilter(addedNode, data.searchTerm);
                    });
                }
            })
        })
     }
 });
 observer.observe(document, { childList: true, subtree: true });
