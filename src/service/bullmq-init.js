const {Queue, Worker} = require('bullmq');
const IORedis = require('ioredis');
const {createJob} = require("./utils");
const {Locator} = require('puppeteer');
const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());
const {io} = require('../socket');

const connection = new IORedis({maxRetriesPerRequest: null});
let functionJob;


const myQueue = new Queue('myqueue', {connection});
const myWorker = new Worker('myqueue', async (job) => {
    const {path} = job.data;
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: path
    });
    await functionJob(browser, puppeteer, Locator);
}, {connection});

myWorker.on('completed', async () => {
    await checkFinish();
})

myWorker.on('failed', async () => {
    await checkFinish();
})

function setFunctionJob(scriptPath) {
    functionJob = createJob(scriptPath)
}

async function checkFinish() {
    console.log(await myQueue.getJobCounts())
    const activeJob = await myQueue.getActiveCount();
    const delayedJob = await myQueue.getDelayedCount();
    const prioritizedJob = await myQueue.getPrioritizedCount();
    const waitingJob = await myQueue.getWaitingCount();
    if (activeJob === 0 && delayedJob === 0 && prioritizedJob === 0 && waitingJob === 0) {
        io.emit('finish-script');
    }
}

async function clearQueue() {
    await myQueue.clean(0, 1000, 'completed');
    await myQueue.clean(0, 1000, 'delayed');
    await myQueue.clean(0, 1000, 'paused');
    await myQueue.clean(0, 1000, 'active');
    await myQueue.clean(0, 1000, 'failed');
    await myQueue.clean(0, 1000, 'prioritized');
    await myQueue.clean(0, 1000, 'wait');
}


module.exports = {myQueue, connection, setFunctionJob, clearQueue}
