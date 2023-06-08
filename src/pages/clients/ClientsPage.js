import style from "./ClientsPage.module.css";

const ClientsPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Klienci</h1>
      </div>
    </div>
  );
};

export default ClientsPage;
