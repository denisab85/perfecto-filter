const thisIsPerfectoCiPage = () => {
  return /https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(
    location.href
  );
};

const doFilter = () => {
  if (thisIsPerfectoCiPage()) {
    chrome.storage.sync.get(["selectedFilter", "enabled"], function (data) {
      var displayed = 0;
      var jobs = document.querySelectorAll("div[class^='JobsList__row']");
      jobs.forEach((element) => {
        var display =
          !data.enabled ||
          !data.selectedFilter ||
          element.getAttribute("data-aid").includes(data.selectedFilter);
        element.style.display = display ? "block" : "none";
        if (display) {
          displayed++;
        }
      });
      updatePopUpCounters(displayed, jobs.length);
    });
  }
};

// Push new counts to the pop-up window
const updatePopUpCounters = (displayed, total) => {
  chrome.runtime.sendMessage({
    message: "filter_counts_updated",
    displayed,
    total,
  });
};

// Send counts to the pop-up upon request
chrome.runtime.onMessage.addListener(({ message }) => {
  if (message === "get_filter_counts") {
    const total = document.querySelectorAll("div[class^='JobsList__row']")
      .length;
    const displayed = document.querySelectorAll(
      "div[class^='JobsList__row']:not([style*='display: none'])"
    ).length;
    updatePopUpCounters(displayed, total);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (thisIsPerfectoCiPage()) {
    for (var key in changes) {
      if (key === "enabled" || key === "selectedFilter") {
        doFilter();
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
        }
      }
    });
  }
});
observer.observe(document, { childList: true, subtree: true });
