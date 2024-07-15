const fs = require('fs');
const path = require('path');

function createJob(pathStr) {
    const filePath = path.join(pathStr);

    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.match(/const browser = await puppeteer\.launch\(\);([\s\S]*?)await browser\.close\(\);/);
    if (newContent) {
        const functionBody = newContent[1];

        const createFunctionFromBody = (body) => {
            // Create a new function with the given body and a 'browser' parameter
            return new Function('browser', 'puppeteer', `return (async () => {${body}})();`);
        };

        return createFunctionFromBody(functionBody);
    }
}

module.exports = {createJob};
