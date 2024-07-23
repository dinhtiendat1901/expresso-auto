const fs = require('fs');
const path = require('path');

function createJob(pathStr) {
    const filePath = path.join(pathStr);
    const content = fs.readFileSync(filePath, 'utf8');
    return new Function('browser', 'puppeteer', 'Locator', `return (async () => {${content}})();`);
}

module.exports = {createJob};
