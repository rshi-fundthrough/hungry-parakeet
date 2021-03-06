const express = require('express');
const http = require("http");
const socketIo = require('socket.io');
const router = require('./router');

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('new client connected')

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        //console.log(io.sockets.adapter.rooms[roomId])
        io.sockets.in(roomId).emit('test', roomId);
    });

    socket.on('selectedVideo', (data) => {
        let videoId = data.video.id.videoId;
        let roomId = data.roomId
        io.sockets.in(roomId).emit('setVideo', videoId);
    });

    socket.on('playPauseVideo', (data) => {
        socket.to(data.roomId).emit('handleSocketPlayPause', data.togglePlayPause);
    });

    socket.on('disconnect', (roomId) => {
        socket.leave(roomId)
        console.log("user disconnected");
    });
});

app.use(router);

server.listen(port, () => console.log(`Listening on port ${port}`));
