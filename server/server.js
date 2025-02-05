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
    //! test it to learn the difference
    // socket.emit("receive-message", data);
    // io.emit("receive-message", data);
    // io.to(room).emit("receive-message", message);
    socket.to(room).emit("receive-message", message);
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
