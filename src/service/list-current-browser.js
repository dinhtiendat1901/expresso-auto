let listCurrentBrowser = []

function setListCurrentBrowser(listBrowserUpdated) {
    listCurrentBrowser.length = 0;  // Clear the array without changing the reference
    listBrowserUpdated.forEach(item => listCurrentBrowser.push(item));  // Add new items
}

module.exports = {listCurrentBrowser, setListCurrentBrowser};
