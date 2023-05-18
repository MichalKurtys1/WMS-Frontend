import style from "./ClientsPage.module.css";

const ClientsPage = () => {
  return (
    <div className={style.container}>
      <img
        className={style.logoImg}
        src={require("../../assets/logo.png")}
        alt="logo"
      />
      <h1>Klienci</h1>
    </div>
  );
};

export default ClientsPage;
