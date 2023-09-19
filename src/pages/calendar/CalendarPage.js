import { FaAngleLeft } from "react-icons/fa";
import style from "./CalendarPage.module.css";
import { useNavigate } from "react-router";

const CalendarPage = () => {
  const navigate = useNavigate();

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
