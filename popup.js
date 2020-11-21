let searchTermInput = document.getElementById("searchTermInput");
let slider = document.getElementById("slider");

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
