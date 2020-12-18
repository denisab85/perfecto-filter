let slider = document.getElementById("slider");
let count = document.getElementById("count");
let btnAddFilter = document.getElementById("add_filter_button");
let btnSaveFilter = document.getElementById("save_filter_button");
let btnCancelEdit = document.getElementById("cancel_edit_button");
let rowFilterEditor = document.getElementById("filter_editor_row");
let inputNewFilter = document.getElementById("new_job_name_edit");
let table = document.getElementById("filter_table");

chrome.storage.sync.get(
  { jobFilters: [], selectedFilter: "" },
  function (data) {
    data.jobFilters.forEach((filter) =>
      addFilterRow(filter, data.selectedFilter === filter)
    );
    addFilterRow("FILTER 6", false);
    addFilterRow("FILTER 5", false);
    addFilterRow("FILTER 4", false);
    addFilterRow("FILTER 3", true);
    addFilterRow("FILTER 2", false);
    addFilterRow("FILTER 1", false);
  }
);

const addFilterRow = (filter, selected) => {
  var row = table.insertRow(1);
  var td = row.insertCell(0);
  td.colSpan = "4";
  td.setAttribute("class", "filter");
  td.setAttribute("selected", selected);
  td.onclick = () => {
    onFilterSelect(td);
  };

  var div = document.createElement("div");
  div.setAttribute("filter", filter);

  var span = document.createElement("span");
  span.setAttribute("class", "filter");
  span.innerText = filter;
  div.appendChild(span);

  td.appendChild(div);
};

const onFilterSelect = (newTd) => {
  var oldTd  = document.querySelector("td.filter[selected='true']");
  newTd.setAttribute("selected", true);
  oldTd.setAttribute("selected", false);
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

const setEditingState = (editing) => {
  let rowAddFilter = document.getElementById("add_filter_row");
  rowAddFilter.style.display = editing ? "none" : "table-row";
  rowFilterEditor.style.display = editing ? "table-row" : "none";
};

btnAddFilter.onclick = () => setEditingState(true);

btnCancelEdit.onclick = () => setEditingState(false);

btnSaveFilter.onclick = () => {
  setEditingState(false);
};
