const {Queue, Worker} = require('bullmq');
const IORedis = require('ioredis');
const {createJob} = require("./utils");
const puppeteer = require("puppeteer");

const connection = new IORedis({maxRetriesPerRequest: null});
let functionJob;

// Reuse the ioredis instance
const myQueue = new Queue('myqueue', {connection});

const myWorker = new Worker('myqueue', async (job) => {
    const {path} = job.data;
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: path
    });

    await functionJob(browser, puppeteer);

}, {connection});

function setFunctionJob(scriptPath) {
    functionJob = createJob(scriptPath)
}


module.exports = {myQueue, connection, setFunctionJob}
