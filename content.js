chrome.storage.onChanged.addListener((changes, namespace) => {
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
      var xpath = "count(//div[starts-with(@class,'JobsList__row')])";
      const total = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      ).numberValue;

      var displayed = 0;
      // Reset style
      xpath =
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
        displayed++;
      }
      if (data.searchTerm && data.enabled) {
        displayed = 0;
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
            displayed++;
          } else {
            element.style.display = "none";
          }
        }
      }
      chrome.runtime.sendMessage({
        message: "filter_updated",
        displayed,
        total,
      });
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
      if (mutation.target.nodeName === "DIV") {
        var className = mutation.target.getAttribute("class");
        if (className && className.startsWith("JobsList")) {
          doFilter();
        }
      }
    });
  }
});
observer.observe(document, { childList: true, subtree: true });
