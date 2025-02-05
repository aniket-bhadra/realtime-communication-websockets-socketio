import React, { useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:3000");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected!!", socket.id);
      console.log(new Date().toLocaleTimeString(), new Date().getMilliseconds());

    });

    socket.on("welcome", (s) => {
      console.log(s);
    });
    console.log(new Date().toLocaleTimeString(), new Date().getMilliseconds());
  }, []);
  return <div>App</div>;
};

export default App;
