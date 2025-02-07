import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 3000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//-----------------socket.io setup
const server = createServer(app);
//circuit creation
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("start");
io.on("connection", (socket) => {
  console.log("user connected ", socket.id);
  //to see how many clients connected
  //   console.log(io.engine.clientsCount)

  socket.emit("welcome", `welcome to the server ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", ({ message, room }) => {
    console.log(message);
    //! uncomment one by one, to learn the difference
    // socket.emit("receive-message", message);
    // io.emit("receive-message", message);
    // socket.broadcast.emit("receive-message", message);
    // io.to(room).emit("receive-message", message);
    socket.to(room).emit("receive-message", message);
    //this means which ever socket is exist in this room, will get this "receive-message" event, means which every socket is exist in this rooom, in client side all of their "recieve-messge" event will triggger,
  });
  socket.on("join-room", (roomName) => {
  //this means whichever socket requests for new room to join, with this,a room will be created with that user will be joining first in the room,
    socket.join(roomName);
    console.log(`user joined ${roomName}`)
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

//-----------------

server.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`server started at ${PORT}`);
// });
