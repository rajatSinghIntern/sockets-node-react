import "./cssforall.css";

const Messages = ({messages, socket}) => {


  return (
    <>
      <ul id="messages">
        {messages.map((message, index) => {
          if (message.nickname === "broadcast") {
            return (
              <li key={index} className="broadcasted">
                {message.content}
              </li>
            );
          } else if (message.senderID === socket.id) {
            return (
              <li
                key={index}
                className="ownmsg"
              >{`You: ${message.content}`}</li>
            );
          } else {
            return (
              <li key={index} className='othermsg'>{`${message.nickname}: ${message.content}`}</li>
            );
          }
        })}
      </ul>
      <p id="typingStatus"></p>
    </>
  );
};

export default Messages;
