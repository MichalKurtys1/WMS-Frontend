import style from "./CalendarPage.module.css";

const CalendarPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Kalendarz</h1>
      </div>
    </div>
  );
};

export default CalendarPage;
