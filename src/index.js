const {app} = require('./socket');
const {createProfile, runJob, runProfile, stopProfile} = require('./service/profile-service');

app.post('/create-profile', async (req, res) => {
    res.send(await createProfile(req.body.path));
});

app.get('/run-profile', async (req, res) => {
    await runProfile(req.query.id, req.query.path);
    res.send('Run Profile Successfully!');
});

app.get('/stop-profile/:id', async (req, res) => {
    await stopProfile(req.params.id);
    res.send('Stop Profile Successfully!');
});

app.post('/run-job', async (req, res) => {
    await runJob(req.body.scriptPath, req.body.listProfilePaths);
    res.send('Run Job Successfully!');
});
