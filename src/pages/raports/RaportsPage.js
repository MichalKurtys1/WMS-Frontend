import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "../raports/RaportsPage.module.css";
import { useState } from "react";
import StockRaport from "./StockRaport";
import OrdersRaport from "./OrdersRaport";
import DeliveriesRaport from "./DeliveriesRaport";
import GeneralRaport from "./GeneralRaport";
import Header from "../../components/Header";

const RaportsPage = () => {
  const [timeScope, setTimeScope] = useState("Tydzień");
  const [raportType, setRaportType] = useState(0);

  const next = () => {
    setRaportType((prevRaportType) =>
      prevRaportType + 1 === 3 ? -1 : prevRaportType + 1
    );
  };

  const prev = () => {
    setRaportType((prevRaportType) =>
      prevRaportType - 1 === -2 ? 2 : prevRaportType - 1
    );
  };

  return (
    <div className={style.container}>
      <Header path={"/"} />
      <div className={style.menu}>
        <h1>Raporty</h1>
        <div className={style.raportsNavigation}>
          <FaAngleLeft
            className={style.icon}
            onClick={() => prev()}
            data-testid="PrevBtn"
          />
          <p>
            {raportType === 0
              ? "Ogólne"
              : raportType === -1
              ? "Zamówienia"
              : raportType === 1
              ? "Dostawy"
              : "Stan Magazynowy"}
          </p>
          <FaAngleRight
            className={style.icon}
            onClick={() => next()}
            data-testid="NextBtn"
          />
        </div>
        <div className={style.timeScope}>
          <select
            className={style.select}
            onChange={(event) => setTimeScope(event.target.value)}
            data-testid="TimescopeSelect"
          >
            <option>Tydzień</option>
            <option>Miesiąc</option>
            <option>Rok</option>
          </select>
        </div>
      </div>
      <div className={style.raportsBox}>
        {raportType === 0 && <GeneralRaport timeScope={timeScope} />}
        {raportType === 2 && <StockRaport timeScope={timeScope} />}
        {raportType === -1 && <OrdersRaport timeScope={timeScope} />}
        {raportType === 1 && <DeliveriesRaport timeScope={timeScope} />}
      </div>
    </div>
  );
};

export default RaportsPage;
