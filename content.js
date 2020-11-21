chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    if (key === "enabled" || key === "searchTerm") {
      doFilter();
    }
  }
});

const doFilter = () => {
  chrome.storage.sync.get(["searchTerm", "enabled"], function (data) {
    if (
      /https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(
        location.href
      )
    ) {
      // Reset style
      let xpath =
        "//div[starts-with(@class,'JobsList__row') and (contains(@style, 'display'))]";
      while (
        (element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue)
      ) {
        element.style.display = null;
      }
      if (data.searchTerm && data.enabled) {
        // Hide divs not containing the serach term
        xpath =
          "//div[starts-with(@class,'JobsList__row') and not (contains(@style, 'display'))]";
        while (
          (element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue)
        ) {
          if (element.getAttribute("data-aid").includes(data.searchTerm)) {
            element.style.display = "block";
          } else {
            element.style.display = "none";
          }
        }
      }
    }
  });
};

var observer = new MutationObserver((mutations) => {
  if (
    /https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(
      location.href
    )
  ) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeName === "DIV") {
          doFilter();
        }
      });
    });
  }
});
observer.observe(document, { childList: true, subtree: true });