let searchTermInput = document.getElementById("searchTermInput");
let slider = document.getElementById("slider");
let count = document.getElementById("count");
let addFilterButton = document.getElementById("add_filter_button");
let saveFilterButton = document.getElementById("save_filter_button");
let cancelEditButton = document.getElementById("cancel_edit_button");
let addFilterRow = document.getElementById("add_filter_row");
let filterEditorRow = document.getElementById("filter_editor_row");
let newJobName = document.getElementById("new_job_name_edit");

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

const displayCounts = (displayed, total) => {
  var string = displayed;
  if (displayed != total) {
    string += " / " + total;
  }
  count.innerHTML = string;
};

// Display updates received from the content page
chrome.runtime.onMessage.addListener(({ message, displayed, total }) => {
  if (message === "filter_counts_updated") {
    displayCounts(displayed, total);
  }
});

// Request the content page to send a counts update (used when the pop-up just appeared)
window.addEventListener("load", (event) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "get_filter_counts",
    });
  });
});

addFilterButton.onclick = () => {
  addFilterRow.style.display = "none";
  filterEditorRow.style.display = "table-row";
};

saveFilterButton.onclick = () => {
  addFilterRow.style.display = "table-row";
  filterEditorRow.style.display = "none";
};

cancelEditButton.onclick = () => {
  addFilterRow.style.display = "table-row";
  filterEditorRow.style.display = "none";
};
