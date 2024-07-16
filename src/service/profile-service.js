const puppeteer = require('puppeteer');
const {v1} = require('uuid');
const {io} = require('../socket');
const {listCurrentBrowser, setListCurrentBrowser} = require('./list-current-browser');
const {myQueue, setFunctionJob} = require("./bullmq-init");

async function createProfile(path) {
    const uuid1 = v1();
    const browser = await puppeteer.launch({
        userDataDir: `${path}/${uuid1}`
    });
    await browser.close();
    return `${path}/${uuid1}`;
}

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

module.exports = {createProfile, runProfile, stopProfile, runJob};
