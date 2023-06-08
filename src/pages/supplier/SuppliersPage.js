import style from "./SuppliersPage.module.css";

const SuppliersPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Dostwacy</h1>
      </div>
    </div>
  );
};

export default SuppliersPage;
