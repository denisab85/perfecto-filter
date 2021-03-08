# perfecto-filter
Perfecto Filter is a Chrome extension for the users of perfectomobile.com continuous integration tool.
While Perfecto itself serves the goal of monitoring the results of test executions, it does not provide any tool to filter the results displayed on the CI dashboard.
This filter extension allows to filter those results by job name.
![alt text](demo.gif)

## Installation in Chrome
1. Download/clone the git project to a local folder (make sure to copy the folder to a permanent location before adding it to Chrome).
2. Once you have your folder, go to the Extensions page in Chrome: chrome://extensions/ (or find it in your menu under More tools -> Extensions).
3. Enable Developer Mode by activating the switch in the top right corner.
4. To install the extension, click "Load unpacked" in the left top corner and select the folder from step 1.

## Using the Extension
- Once installed, the icon of the extension will appear on the extensions bar in Chrome (look for a teal-colored funnel).
- Open the Perfecto CI Dashboard page (it is the only page where this extension functions): https://your-company.app.perfectomobile.com/reporting/dashboard-ci
- Click on the extension icon - a pop-up window will appear next to it.
- Enable/disable filtering altogether by using the green switch in the right top corner of the pop-up window.
### To add a filter:
- Click on the "Add another filter" link.
- Enter a part of your CI job name in the input field.
- Click on the save button (✓).
### To use filters:
- Make sure filtering is enabled (the green switch).
- Select a desired filter by clicking on it.
- The list on the CI page will be filtered and the number of pertinent jobs will be updated at the bottom of the pop-up.
