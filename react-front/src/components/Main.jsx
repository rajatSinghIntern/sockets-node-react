import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import Form from "./Form";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Main() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);

    socket.on("typing", (msg) => {
      document.getElementById("typingStatus").textContent = msg;
      setTimeout(
        () => (document.getElementById("typingStatus").textContent = ""),
        1000
      );
    });

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("broadcasted", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { nickname: "broadcast", content: msg },
      ]);
    });

    socket.on("disconnectionByUser", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { nickname: "broadcast", content: msg },
      ]);
    });

    window.addEventListener("beforeunload", handleDisconnectionByClient);

    return () => {
      handleDisconnectionByClient();
      socket.off("chat message");
      socket.off("broadcasted");
      socket.off("disconnectionByUser");
      window.removeEventListener("beforeunload", handleDisconnectionByClient);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNickname(document.getElementById("nickname").value);
    setInput(document.getElementById("input").value);

    if (nickname && input) {
      const message = {
        senderID: socket.id,
        nickname,
        content: input,
      };

      socket.emit("chat message", message);
      document.getElementById("input").value = "";
    } else {
      alert("Fields cannot be empty!");
    }
  };

  const handleDisconnectionByClient = () => {
    let name = document.getElementById("nickname").value || "user";
    socket.emit("disconnectionByClient", {
      name,
    });
  };

  const handleOnchange = (e) => {
    if (e.target.name === "nickname") {
      setNickname(e.target.value);
    } else {
      setInput(e.target.value);
      //   document.getElementById('typingStatus').textContent = `${document.getElementsByName('nickname').value} is typing`;
      socket.emit("typing", { name: nickname || "someone" });
    }
  };

  return (
    <div className="container">
      <Messages messages={messages} socket={socket} />
      <Form
        handleSubmit={handleSubmit}
        handleOnchange={handleOnchange}
        nickname={nickname}
        message={input}
      />
    </div>
  );
}
