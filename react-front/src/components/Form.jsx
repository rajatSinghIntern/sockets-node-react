import './cssforall.css';

const Form = ({handleSubmit, handleOnchange, nickname, message}) => {
  return (
    <form id="form" onSubmit={handleSubmit}>
      <input id="nickname" name="nickname" onChange={handleOnchange} value={nickname} placeholder="Nickname" />
      <br />
      <input id="input" name="message" onChange={handleOnchange} value={message} autoComplete="off" />
      <button type="submit">Send</button>
    </form>
  );
};

export default Form;