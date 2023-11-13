import { useEffect, useState } from "react";
import style from "./DashboardPage.module.css";
import { getAuth } from "../../context";
import ErrorHandler from "../../components/ErrorHandler";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { useQuery } from "@apollo/client";
import Loading from "../../components/Loading";
import { GET_DASHBOARD_DATA } from "../../utils/apollo/apolloMultipleQueries";

const DashboardPage = () => {
  const [error, setError] = useState();
  const [events, setEvents] = useState();
  const { position } = getAuth();
  const [warnings, setWarnings] = useState();
  const { data, loading } = useQuery(GET_DASHBOARD_DATA, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [countedData, setCountedData] = useState({
    started: 0,
    during: 0,
    finished: 0,
    income: 0,
    expenses: 0,
    bilans: 0,
    incomming: 0,
    outgoing: 0,
  });

  useEffect(() => {
    if (data && position !== "Przewoźnik") {
      setCountedData(JSON.parse(data.dashboardReport.dashboardData));
      setEvents(data.formatedCalendar.standardData);
    }
    if (data && position === "Przewoźnik") {
      setEvents(data.formatedCalendar.carrierData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, position]);

  useEffect(() => {
    if (data && data.stocks) {
      const isExisting = data.stocks.filter(
        (item) => item.totalQuantity < 50 || item.availableStock < 50
      );
      if (isExisting.length !== 0) {
        setWarnings(
          isExisting.map((item) => {
            return (
              item.product.name +
              " " +
              item.product.type +
              " " +
              item.product.capacity
            );
          })
        );
      } else {
        setWarnings(false);
      }
    }
  }, [data]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      <div className={style.leftBox}>
        <div className={style.upperBox}>
          <img src={require("../../assets/logo_small.png")} alt={"logo"} />
          <h1>Dashboard</h1>
        </div>
        <div className={style.middleBox}>
          <div className={style.dataBox}>
            <p>Nadchodzące</p>
            <span>{countedData.started}</span>
          </div>
          <div className={style.dataBox}>
            <p>W trakcie</p>
            <span>{countedData.during}</span>
          </div>
          <div className={style.dataBox}>
            <p>Zakończone</p>
            <span>{countedData.finished}</span>
          </div>
          <div className={style.dataBox}>
            <p>Bilans</p>
            <span>{countedData.bilans} zł</span>
          </div>
          <div className={style.dataBox}>
            <p>Wydatki</p>
            <span>{countedData.expenses} zł</span>
          </div>
          <div className={style.dataBox}>
            <p>Przychody</p>
            <span>{countedData.income} zł</span>
          </div>
        </div>
        <div className={style.lowerBox}>
          <h2>Produkty</h2>
          <div className={style.dataBox}>
            <p>Przychodzące</p>
            <span>{countedData.incomming}</span>
          </div>
          <div className={style.dataBox}>
            <p>Wychodzące</p>
            <span>{countedData.outgoing}</span>
          </div>
        </div>
        <div className={style.warningBox}>
          <h2>Ostrzeżenia</h2>
          {!warnings && (
            <p style={{ textAlign: "center", fontSize: 20 }}>Brak ostrzeżeń</p>
          )}
          {warnings &&
            warnings.map((item) => (
              <div className={style.warning}>
                <BsExclamationTriangleFill className={style.icon} />
                <p>Ilość {item} spadł poniżej 50</p>
              </div>
            ))}
        </div>
      </div>
      <div className={style.rightBox}>
        <h3>Wydarzenia</h3>
        <div className={style.eventsBox}>
          {events &&
            events.map((item) => {
              const eventTime = new Date(+item.date)
                .toISOString()
                .split("T")[0];
              const tileTime = new Date(
                new Date().getTime() - 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0];

              if (eventTime === tileTime) {
                return (
                  <div className={style.event} key={item.time}>
                    <p>
                      <span>{item.time}</span> - {item.event}
                    </p>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
