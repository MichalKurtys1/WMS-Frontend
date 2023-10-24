import { useEffect, useState } from "react";
import { useCalendar } from "../../hooks/useCalendar";
import style from "./DashboardPage.module.css";
import { getAuth } from "../../context";
import ErrorHandler from "../../components/ErrorHandler";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { useQuery } from "@apollo/client";
import { GET_STOCKS } from "../../utils/apollo/apolloQueries";
import Loading from "../../components/Loading";

const DashboardPage = () => {
  const { error, loading, data } = useCalendar();
  const [events, setEvents] = useState();
  const { position } = getAuth();
  const [warnings, setWarnings] = useState();
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
  const { data: stocks } = useQuery(GET_STOCKS);

  const dataCountingHandler = () => {
    let tempData = {
      started: 0,
      during: 0,
      finished: 0,
      incomming: 0,
      outgoing: 0,
    };
    data.orders.forEach((element) => {
      const date = +element.expectedDate - 24 * 60 * 60 * 1000;
      const eventTime = new Date(date).toISOString().split("T")[0];
      const tileTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      if (eventTime === tileTime) {
        const prods = JSON.parse(JSON.parse(element.products));
        prods.forEach((element) => {
          tempData.outgoing += +element.quantity;
        });
        if (element.state === "Zamówiono" || element.state === "Pre Order") {
          tempData.started += 1;
        } else if (element.state === "Zakończono") {
          tempData.finished += 1;
        } else {
          tempData.during += 1;
        }
      }
    });

    data.deliveries.forEach((element) => {
      const date = +element.expectedDate - 24 * 60 * 60 * 1000;
      const eventTime = new Date(date).toISOString().split("T")[0];
      const tileTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      if (eventTime === tileTime) {
        const prods = JSON.parse(JSON.parse(element.products));
        prods.forEach((element) => {
          tempData.incomming += +element.quantity;
        });
        if (element.state === "Zamówiono") {
          tempData.started += 1;
        } else if (element.state === "Zakończono") {
          tempData.finished += 1;
        } else {
          tempData.during += 1;
        }
      }
    });
    return {
      incomming: tempData.incomming,
      outgoing: tempData.outgoing,
      started: tempData.started,
      during: tempData.during,
      finished: tempData.finished,
    };
  };

  const bilansCountHandler = () => {
    const currentDate = new Date(new Date().getTime())
      .toISOString()
      .split("T")[0];
    let totalIncome = 0;
    let totalExpenses = 0;

    data.orders.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      if (orderDate === currentDate) {
        totalIncome += order.totalPrice;
      }
    });

    data.deliveries.forEach((deliveries) => {
      const orderDate = new Date(+deliveries.date).toISOString().split("T")[0];

      if (orderDate === currentDate) {
        totalExpenses += deliveries.totalPrice;
      }
    });
    return {
      income: totalIncome.toFixed(0),
      expenses: totalExpenses.toFixed(0),
      bilans: (totalIncome - totalExpenses).toFixed(0),
    };
  };

  useEffect(() => {
    let results = [];
    if (
      data &&
      data.deliveries &&
      data.orders &&
      data.calendar &&
      data.shipments &&
      position !== "Przewoźnik"
    ) {
      const bilansData = bilansCountHandler();
      const countingData = dataCountingHandler();
      setCountedData({
        started: countingData.started,
        during: countingData.during,
        finished: countingData.finished,
        income: bilansData.income,
        expenses: bilansData.expenses,
        bilans: bilansData.bilans,
        incomming: countingData.incomming,
        outgoing: countingData.outgoing,
      });
      let deli = data.deliveries
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: +item.expectedDate - 24 * 60 * 60 * 1000,
              time: "--:--",
              event: "Dostawa " + item.supplier.name,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let orde = data.orders
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: +item.expectedDate - 24 * 60 * 60 * 1000,
              time: "--:--",
              event: "Zamówienie " + item.client.name,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let ship = data.shipments
        .map((item) => {
          if (item.state !== "Zakończono") {
            return {
              date: (
                new Date(item.deliveryDate).getTime() -
                24 * 60 * 60 * 1000
              ).toString(),
              time: "--:--",
              event: "Wysyłka " + item.employee,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && Object.keys(item).length !== 0);
      let cale = data.calendar;
      results = cale.concat(orde, deli, ship);
      setEvents(results);
    }
    if (data && data.shipments && data.calendar && position === "Przewoźnik") {
      let ship = data.shipments.map((item) => {
        return {
          date: (
            new Date(item.deliveryDate).getTime() -
            24 * 60 * 60 * 1000
          ).toString(),
          time: "--:--",
          event: "Wysyłka " + item.employee,
        };
      });
      let cale = data.calendar;
      results = cale.concat(ship);
      setEvents(results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, position]);

  useEffect(() => {
    if (stocks) {
      const isExisting = stocks.stocks.filter(
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
  }, [stocks]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      <Loading state={!data && loading && !error} />
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
                  <div className={style.event}>
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
