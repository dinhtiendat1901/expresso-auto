const {Server} = require('socket.io');
const {createServer} = require('http');
const express = require('express');

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

module.exports = {io, server, app};
