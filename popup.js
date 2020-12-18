let slider = document.getElementById("slider");
let count = document.getElementById("count");
let btnAddFilter = document.getElementById("add_filter_button");
let btnSaveFilter = document.getElementById("save_filter_button");
let btnCancelEdit = document.getElementById("cancel_edit_button");
let rowAddFilter = document.getElementById("add_filter_row");
let rowFilterEditor = document.getElementById("filter_editor_row");
let inputNewFilter = document.getElementById("new_job_name_edit");
let table = document.getElementById("filter_table");

chrome.storage.sync.get(
  { jobFilters: [], selectedFilter: "" },
  function (data) {
    data.jobFilters.forEach((filter) =>
      addFilterRow(filter, data.selectedFilter)
    );

    addFilterRow("FILTER");
  }
);

const addFilterRow = (filter, selectedFilter) => {
  var row = table.insertRow(1);
  var cell = row.insertCell(0);
  cell.colSpan = "4";
  cell.setAttribute("class", "filter");

  var div = document.createElement("div");
  div.setAttribute("filter", filter);
  div.onkeydown = onFilterSelect;

  var span = document.createElement("span");
  span.setAttribute("class", "filter");
  span.innerText = filter;
  div.appendChild(span);

  cell.appendChild(div);
};

const onFilterSelect = (element) => {
  chrome.storage.sync.set({ selectedFilter: element.value }, () => {});
};

chrome.storage.sync.get("enabled", function (data) {
  slider.checked = data.enabled;
});

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

btnAddFilter.onclick = () => {
  rowAddFilter.style.display = "none";
  rowFilterEditor.style.display = "table-row";
};

btnSaveFilter.onclick = () => {
  rowAddFilter.style.display = "table-row";
  rowFilterEditor.style.display = "none";
};

btnCancelEdit.onclick = () => {
  rowAddFilter.style.display = "table-row";
  rowFilterEditor.style.display = "none";
};
