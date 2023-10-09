import style from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <div className={style.container}>
      <p>- stock warning gdy za mało</p>
      <p>
        - najbliższe wydarzenia dla danego stanowiska, ważne info + możliwość
        dodawania go przez menadżera/admina
      </p>
      <p>
        - bilans/wydatki/przychody i w tracie/nierozpoczęte i dostawy/zamówienia
        ilość - dzień dzisiejszy tylko
      </p>
    </div>
  );
};

export default DashboardPage;
