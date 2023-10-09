import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import style from "../raports/RaportsPage.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import StockRaport from "./StockRaport";
import OrdersRaport from "./OrdersRaport";
import DeliveriesRaport from "./DeliveriesRaport";
import GeneralRaport from "./GeneralRaport";

const RaportsPage = () => {
  const navigate = useNavigate();
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
      <div className={style.menu}>
        <h1>Raporty</h1>
        <div className={style.raportsNavigation}>
          <FaAngleLeft className={style.icon} onClick={() => prev()} />
          <p>
            {raportType === 0
              ? "Ogólne"
              : raportType === -1
              ? "Zamówienia"
              : raportType === 1
              ? "Dostawy"
              : "Stan Magazynowy"}
          </p>
          <FaAngleRight className={style.icon} onClick={() => next()} />
        </div>
        <div className={style.timeScope}>
          <select
            className={style.select}
            onChange={(event) => setTimeScope(event.target.value)}
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
