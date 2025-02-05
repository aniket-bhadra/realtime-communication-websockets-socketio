import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

//moved it outside of the component so it doesn't create a new socket connection on every render. The socket instance remains the same across renders, preventing multiple connections.
const socket = io("http://localhost:3000");

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected!!", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      // console.log(data);
      setAllMessages((existingMsgs) => [data, existingMsgs]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>
    
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginLeft: "25px" }}
        >
          send
        </Button>
      </form>

      <Stack>
        {allMessages.map((msg, index) => {
          return (
            <Typography gutterBottom variant="h6" component="div" key={index}>
              {msg}
            </Typography>
          );
        })}
      </Stack>
    </Container>
  );
};

export default App;
