const thisIsPerfectoCiPage = () => {
  return /https:\/\/\w+.app.perfectomobile.com\/reporting\/dashboard-ci/.test(
    location.href
  );
};

const doFilter = () => {
  if (thisIsPerfectoCiPage()) {
    chrome.storage.sync.get(["searchTerm", "enabled"], function (data) {
      var displayed = 0;
      var jobs = document.querySelectorAll("div[class^='JobsList__row']");
      jobs.forEach((element) => {
        var display =
          !data.enabled ||
          !data.searchTerm ||
          element.getAttribute("data-aid").includes(data.searchTerm);
        element.style.display = display ? "block" : "none";
        if (display) {
          displayed++;
        }
      });
      updatePopUpCounters(displayed, jobs.length);
    });
  }
};

const updatePopUpCounters = (displayed, total) => {
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
