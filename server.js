
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const sharedState = {
  switches: {},
  utd: {}
};

io.on("connection", (socket) => {
  socket.emit("state:init", sharedState);

  socket.on("state:update", (partial) => {
    if (partial.switches) Object.assign(sharedState.switches, partial.switches);
    if (partial.utd) Object.assign(sharedState.utd, partial.utd);
    socket.broadcast.emit("state:update", partial);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
