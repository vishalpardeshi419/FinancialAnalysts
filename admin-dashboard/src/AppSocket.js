import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Connect to the backend server

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");
 
    socket.on("connect", () => {
      console.log("Connected to the server with ID:", socket.id);
    });
  
    // Listen for broadcast messages from the server
    socket.on("receive_message", (data) => {
      console.log("Message received from server:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  
  const sendMessage = () => {
    if (message.trim()) {
      console.log("message", message);
      socket.emit("send_message", message); // Send message to the server
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Socket.IO Chat</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px" }}>
          Send
        </button>
      </div>
      <div>
        <h2>Messages:</h2>
        {messages.map((msg, index) => (
          <p key={index} style={{ background: "#f1f1f1", padding: "10px" }}>
            {msg}
          </p>
        ))}
      </div>
    </div>

  );
}

export default App;
