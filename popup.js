let slider = document.getElementById("slider");
let count = document.getElementById("count");
let btnAddFilter = document.getElementById("add_filter_button");
let btnSaveFilter = document.getElementById("save_filter_button");
let btnCancelEdit = document.getElementById("cancel_edit_button");
let rowFilterEditor = document.getElementById("filter_editor");
let filterInput = document.getElementById("filter_input");

var filterBeingEdited = null;

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
      onFilterSelect(li);
    };

    edit_button.setAttribute("type", "button");
    edit_button.setAttribute("class", "image_button");
    edit_button.setAttribute("id", "edit_filter_button");
    edit_button.onclick = () => {
      editFilter(li);
    };

    delete_button.setAttribute("type", "button");
    delete_button.setAttribute("class", "image_button");
    delete_button.setAttribute("id", "delete_filter_button");
    delete_button.onclick = () => {
      deleteFilter(li);
    };

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

const findFilterElement = (filter) => {
  return document.querySelector(
    ".filter[value='" + filter.replace(/["\\']/g, "\\$&") + "']"
  );
};

const updateFilterRow = (filterOld, filterNew) => {
  var li = findFilterElement(filterOld);
  li.firstChild.innerHTML = filterNew;
  li.setAttribute("value", filterNew);
};

const onFilterSelect = (newItem) => {
  var oldItem = document.querySelector(".filter[selected='true']");
  if (oldItem) {
    oldItem.setAttribute("selected", false);
  }
  newItem.setAttribute("selected", true);
  chrome.storage.sync.set(
    { selectedFilter: newItem.getAttribute("value") },
    () => {}
  );
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
  if (editing) {
    addFilter.classList.add("hidden");
    editFilter.classList.remove("hidden");
  } else {
    filterBeingEdited = null;
    addFilter.classList.remove("hidden");
    editFilter.classList.add("hidden");
  }
};

const editFilter = (li) => {
  filterBeingEdited = li.getAttribute("value");
  filterInput.value = li.getAttribute("value");
  setEditingState(true);
};

const deleteFilter = (li) => {
  chrome.storage.sync.get(
    { jobFilters: [], selectedFilter: "" },
    ({ jobFilters, selectedFilter }) => {
      var filter = li.getAttribute("value");
      if (jobFilters.includes(filter)) {
        jobFilters.splice(jobFilters.indexOf(filter), 1);
        if (filter === selectedFilter) {
          selectedFilter = null;
        }
        chrome.storage.sync.set({ jobFilters, selectedFilter }, () => {});
        li.parentNode.removeChild(li);
      }
    }
  );
};

const addFilter = (filter) => {
  if (filter) {
    chrome.storage.sync.get({ jobFilters: [] }, ({ jobFilters }) => {
      if (!jobFilters.includes(filter)) {
        jobFilters.push(filter);
        addFilterRow(filter, false);
        chrome.storage.sync.set({ jobFilters }, () => {});
      }
    });
  }
};

const updateFilter = (filterOld, filterNew) => {
  if (filterOld && filterNew) {
    chrome.storage.sync.get(
      { jobFilters: [], selectedFilter: "" },
      ({ jobFilters, selectedFilter }) => {
        jobFilters[jobFilters.indexOf(filterOld)] = filterNew;
        updateFilterRow(filterOld, filterNew);
        if (filterOld === selectedFilter) {
          selectedFilter = filterNew;
        }
        chrome.storage.sync.set({ jobFilters, selectedFilter }, () => {});
      }
    );
  }
};

btnAddFilter.onclick = () => {
  filterInput.value = "";
  setEditingState(true);
};

btnCancelEdit.onclick = () => setEditingState(false);

btnSaveFilter.onclick = () => {
  if (filterBeingEdited) {
    updateFilter(filterBeingEdited, filterInput.value);
  } else {
    addFilter(filterInput.value);
  }
  setEditingState(false);
};
