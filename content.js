const thisIsPerfectoCiPage = () => {
  return /https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(
    location.href
  );
};

const doFilter = () => {
  if (thisIsPerfectoCiPage()) {
    chrome.storage.sync.get(["searchTerm", "enabled"], function (data) {
      var jobs = document.querySelectorAll("div[class^='JobsList__row']");
      jobs.forEach((element) => {
        var display =
          data.enabled &&
          data.searchTerm &&
          !element.getAttribute("data-aid").includes(data.searchTerm)
            ? "none"
            : "block";
        element.style.display = display;
      });
    });
  }
};

const updatePopUpCounters = () => {
  const total = document.evaluate(
    "count(//div[starts-with(@class,'JobsList__row')])",
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  ).numberValue;
  const displayed = document.evaluate(
    "count(//div[starts-with(@class,'JobsList__row') and not (contains(@style,'display: none'))])",
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  ).numberValue;
  chrome.runtime.sendMessage({
    message: "filter_updated",
    displayed,
    total,
  });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (thisIsPerfectoCiPage()) {
    for (var key in changes) {
      if (key === "enabled" || key === "searchTerm") {
        doFilter();
        updatePopUpCounters();
      }
    }
  }
});

var observer = new MutationObserver((mutations) => {
  if (thisIsPerfectoCiPage()) {
    mutations.forEach((mutation) => {
      if (mutation.target.nodeName === "DIV") {
        var className = mutation.target.getAttribute("class");
        if (className && className.startsWith("JobsList")) {
          doFilter();
          updatePopUpCounters();
        }
      }
    });
  }
});
observer.observe(document, { childList: true, subtree: true });
