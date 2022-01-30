import { createServer } from "http";
import { Server } from "socket.io";
import { CONTROL_CHANGE, NOTE_ON, NOTE_OFF, SOCKET_PORT } from "common";
import { Input, Output } from "easymidi";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const NAME = "MIDULAR";

io.on("connection", (socket) => {
  const output = new Output(NAME, true);
  console.log("connection!");

  socket.on(CONTROL_CHANGE, (msg) => {
    output.send("cc", {
      channel: msg.channel,
      value: msg.value,
      controller: 1, // TODO: Implement controller setup
    });
  });
  socket.on(NOTE_ON, (msg) => {
    output.send("noteon", {
      channel: msg.channel,
      note: msg.value,
      velocity: 60, // TODO: Implement velocity controls
    });
  });
  socket.on(NOTE_OFF, (msg) => {
    output.send("noteoff", {
      channel: msg.channel,
      note: msg.value,
      velocity: 60, // TODO: Implement velocity controls
    });
  });
});

io.listen(SOCKET_PORT);
