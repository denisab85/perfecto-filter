let searchTermInput = document.getElementById("searchTermInput");
let slider = document.getElementById("slider");
let count = document.getElementById("count");

chrome.storage.sync.get("searchTerm", function (data) {
  searchTermInput.value = data.searchTerm;
  searchTermInput.setAttribute("value", data.searchTerm);
});

chrome.storage.sync.get("enabled", function (data) {
  slider.checked = data.enabled;
});

var timeoutId = 0;

searchTermInput.onkeydown = (element) => {
  if (timeoutId != 0) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    chrome.storage.sync.set({ searchTerm: searchTermInput.value }, () => {});
  }, 500);
};

slider.onclick = () => {
  chrome.storage.sync.set({ enabled: slider.checked }, () => {});
};

chrome.runtime.onMessage.addListener(({ message, displayed, total }) => {
  if (message === "filter_updated") {
    var string = displayed;
    if (displayed != total) {
      string += " / " + total;
    }
    count.innerHTML = string;
  }
});
