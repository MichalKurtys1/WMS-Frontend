import style from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Dashboard</h1>
      </div>
    </div>
  );
};

export default DashboardPage;
