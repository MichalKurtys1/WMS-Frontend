import style from "./DashboardPage.module.css";
import { FaAngleLeft } from "react-icons/fa";

const DashboardPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
