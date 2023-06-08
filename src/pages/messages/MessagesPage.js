import style from "./MessagesPage.module.css";

const MessagesPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Wiadomości</h1>
      </div>
    </div>
  );
};

export default MessagesPage;
