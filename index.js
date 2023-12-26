const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit('broadcasted', "a new user connected!");
  socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
  });
  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", `${msg.name||'someone'} is typing...`);
  });
  socket.on("disconnectionByClient", (msg) => {
    io.emit("disconnectionByUser", `${msg.name} has disconnected`);
  });
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening at 3000!");
});
