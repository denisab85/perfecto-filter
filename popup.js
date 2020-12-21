let slider = document.getElementById("slider");
let count = document.getElementById("count");
let btnAddFilter = document.getElementById("add_filter_button");
let btnSaveFilter = document.getElementById("save_filter_button");
let btnCancelEdit = document.getElementById("cancel_edit_button");
let rowFilterEditor = document.getElementById("filter_editor");

const loadFilters = () => {
  chrome.storage.sync.get(
    { jobFilters: [], selectedFilter: "" },
    function (data) {
      var allFilters = [];
      data.jobFilters.forEach((f) => {
        if (f != null && f != "" && !allFilters.includes(f)) {
          allFilters.push(f);
        }
      });
      data.jobFilters.forEach((filter) =>
        addFilterRow(filter, data.selectedFilter === filter)
      );
    }
  );
};

loadFilters();

const addFilterRow = (filter, selected) => {
  let ul = document.getElementById("filter_list");
  if (filter) {
    var li = document.createElement("li");
    var text = document.createElement("div");
    var buttons = document.createElement("span");
    var edit_button = document.createElement("input");
    var delete_button = document.createElement("input");

    li.setAttribute("class", "filter text block");

    text.setAttribute("class", "left");
    text.innerHTML = filter;
    text.onclick = () => {
      onFilterSelect(filter);
    };

    edit_button.setAttribute("type", "button");
    edit_button.setAttribute("class", "image_button");
    edit_button.setAttribute("id", "edit_filter_button");

    delete_button.setAttribute("type", "button");
    delete_button.setAttribute("class", "image_button");
    delete_button.setAttribute("id", "delete_filter_button");

    buttons.setAttribute("class", "right button_group");
    buttons.appendChild(edit_button);
    buttons.appendChild(delete_button);

    li.setAttribute("selected", selected);
    li.setAttribute("value", filter);
    li.appendChild(text);
    li.appendChild(buttons);

    ul.appendChild(li);
  }
};

const onFilterSelect = (filter) => {
  var oldItem = document.querySelector(".filter[selected='true']");
  var newItem = document.querySelector(
    ".filter[value='" + filter.replace(/["\\']/g, "\\$&") + "']"
  );
  oldItem.setAttribute("selected", false);
  newItem.setAttribute("selected", true);
  chrome.storage.sync.set({ selectedFilter: filter }, () => {});
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
  let addFilter = document.getElementById("add_filter");
  let editFilter = document.getElementById("filter_editor");
  let input = document.getElementById("new_filter_edit");
  input.value = "";
  if (editing) {
    addFilter.classList.add("hidden");
    editFilter.classList.remove("hidden");
  } else {
    addFilter.classList.remove("hidden");
    editFilter.classList.add("hidden");
  }
};

const changeFilter = (oldFilter, newFilter) => {};

const addFilter = (filter) => {
  if (filter) {
    chrome.storage.sync.get({ jobFilters: [] }, (data) => {
      if (!data.jobFilters.includes(filter)) {
        data.jobFilters.push(filter);
        addFilterRow(filter, false);
        chrome.storage.sync.set({ jobFilters: data.jobFilters }, () => {});
      }
    });
  }
};

btnAddFilter.onclick = () => setEditingState(true);

btnCancelEdit.onclick = () => setEditingState(false);

btnSaveFilter.onclick = () => {
  let inputNewFilter = document.getElementById("new_filter_edit");
  var filter = inputNewFilter.value;
  var addNew = true;
  // changeFilter(filter);
  addFilter(filter);
  setEditingState(false);
};
