const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());
const {io} = require('../socket');
const {listCurrentBrowser, setListCurrentBrowser} = require('./list-current-browser');
const {myQueue, setFunctionJob, clearQueue} = require("./bullmq-init");


async function runProfile(id, path) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: path
    });

    browser.on('disconnected', () => {
        io.emit('close-profile', id);
        setListCurrentBrowser(listCurrentBrowser.filter(browserIndex => browserIndex.id !== id));
    });

    listCurrentBrowser.push({
        id,
        browser
    });
}

async function stopProfile(id) {
    const browser = listCurrentBrowser.find(browserIndex => browserIndex.id === id)?.browser;
    if (browser) {
        await browser.close();
    }
}

async function runJob(scriptPath, listProfilePaths) {
    await clearQueue();
    setFunctionJob(scriptPath);
    await myQueue.addBulk(listProfilePaths.map(profilePath => {
        return {
            name: 'job',
            data: {
                path: profilePath
            }
        }
    }))
}

module.exports = {runProfile, stopProfile, runJob};
