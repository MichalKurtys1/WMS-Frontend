import { useState } from "react";
import style from "./GeneralRaport.module.css";
import { useQuery } from "@apollo/client";
import {
  GET_CLIENTS,
  GET_DELIVERIES,
  GET_ORDERS,
  GET_PRODUCTS,
  GET_STOCKS,
} from "../../utils/apollo/apolloQueries";
import ErrorHandler from "../../components/ErrorHandler";
import { useEffect } from "react";
import Spinner from "../../components/Spiner";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { IoIosWarning } from "react-icons/io";
import { BsX } from "react-icons/bs";

const GeneralRaport = ({ timeScope }) => {
  const [generalResults, setGeneralResults] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [sumData, setSumData] = useState({
    income: 0,
    expenses: 0,
    bilans: 0,
  });
  const [generalData, setGeneralData] = useState([]);
  const [error, setError] = useState();
  const { data: orders, loading } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: deliveries } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: products } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: clients } = useQuery(GET_CLIENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: stocks } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  const weekOrdersCountHandler = () => {
    const currentDate = new Date();
    const daysOfWeek = [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ];
    const dayNumbers = [];
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let i = 0; i < 7; i++) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - i);
      const dayNumber = previousDate.getDay();
      dayNumbers.push({
        dayName: daysOfWeek[dayNumber],
        date: previousDate.toISOString().split("T")[0],
      });
    }
    const initialData = dayNumbers.reverse().map((day) => ({
      x: day.dayName,
      Przychody: 0,
      Wydatki: 0,
      z: day.date,
    }));

    orders.orders.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = initialData.find(
        (dataPoint) => dataPoint.z === orderDate
      );

      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += order.totalPrice;
      }
    });

    deliveries.deliveries.forEach((deliveries) => {
      const orderDate = new Date(+deliveries.date).toISOString().split("T")[0];
      const matchingDataPoint = initialData.find(
        (dataPoint) => dataPoint.z === orderDate
      );

      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += deliveries.totalPrice;
      }
    });
    const bilans = initialData.map((item) => {
      return {
        x: item.x,
        y: +item.Przychody - +item.Wydatki,
      };
    });

    setGeneralData([{ id: "bilans", data: bilans }]);
    setGeneralResults(initialData);
    setSumData({
      ...sumData,
      income: totalIncome.toFixed(0),
      expenses: totalExpenses.toFixed(0),
      bilans: (totalIncome - totalExpenses).toFixed(0),
    });
  };

  const monthOrdersCountHandler = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dataArray = [];
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      dataArray.push({
        x: formattedDate,
        Przychody: 0,
        Wydatki: 0,
      });
    }

    orders.orders.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = dataArray.find(
        (dataPoint) => dataPoint.x === orderDate
      );

      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += order.totalPrice;
      }
    });

    deliveries.deliveries.forEach((deliveries) => {
      const deliveriesDate = new Date(+deliveries.date)
        .toISOString()
        .split("T")[0];
      const matchingDataPoint = dataArray.find(
        (dataPoint) => dataPoint.x === deliveriesDate
      );

      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += deliveries.totalPrice;
      }
    });

    const bilans = dataArray.map((item) => {
      return {
        x: item.x,
        y: +item.Przychody - +item.Wydatki,
      };
    });

    setGeneralData([{ id: "bilans", data: bilans }]);
    setGeneralResults(dataArray);
    setSumData({
      ...sumData,
      income: totalIncome.toFixed(0),
      expenses: totalExpenses.toFixed(0),
      bilans: (totalIncome - totalExpenses).toFixed(0),
    });
  };

  const yearOrdersCountHandler = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const months = [];
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let month = 0; month < 12; month++) {
      months.push({
        x: `${currentYear}-${month + 1 < 10 ? "0" : ""}${month + 1}`,
        Przychody: 0,
        Wydatki: 0,
      });
    }

    orders.orders.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().slice(0, 7);
      const matchingDataPoint = months.find(
        (dataPoint) => dataPoint.x === orderDate
      );

      if (matchingDataPoint) {
        totalIncome += order.totalPrice;
        matchingDataPoint.Przychody += order.totalPrice;
      }
    });

    deliveries.deliveries.forEach((deliveries) => {
      const deliveriesDate = new Date(+deliveries.date)
        .toISOString()
        .slice(0, 7);
      const matchingDataPoint = months.find(
        (dataPoint) => dataPoint.x === deliveriesDate
      );

      if (matchingDataPoint) {
        totalExpenses += deliveries.totalPrice;
        matchingDataPoint.Wydatki += deliveries.totalPrice;
      }
    });

    const bilans = months.map((item) => {
      return {
        x: item.x,
        y: +item.Przychody - +item.Wydatki,
      };
    });

    setGeneralData([{ id: "bilans", data: bilans }]);
    setGeneralResults(months);
    setSumData({
      ...sumData,
      income: totalIncome.toFixed(0),
      expenses: totalExpenses.toFixed(0),
      bilans: (totalIncome - totalExpenses).toFixed(0),
    });
  };

  useEffect(() => {
    if (stocks) {
      const isExisting = stocks.stocks.filter(
        (item) => item.totalQuantity < 50 || item.availableStock < 50
      );
      if (isExisting.length !== 0) {
        setIsOpen(
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
        setIsOpen(false);
      }
    }
  }, [stocks]);

  useEffect(() => {
    if (orders && deliveries && products && clients && stocks) {
      if (timeScope === "Tydzień") {
        weekOrdersCountHandler();
      } else if (timeScope === "Miesiąc") {
        monthOrdersCountHandler();
      } else if (timeScope === "Rok") {
        yearOrdersCountHandler();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, deliveries, timeScope, products, clients, stocks]);
  console.log(generalData);
  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      {loading && <Spinner />}
      {isOpen && (
        <div className={style.warning}>
          <BsX className={style.cancel} onClick={() => setIsOpen(false)} />
          <IoIosWarning className={style.icon} />
          <div className={style.messageBox}>
            <h1>Stan magazynowy</h1>
            <p>
              Ilość{" "}
              {isOpen.map((item) => {
                return item + ", ";
              })}{" "}
              spadł poniżej 50
            </p>
          </div>
        </div>
      )}

      <div className={style.sumBox}>
        <div
          className={style.sum}
          style={{
            backgroundColor: sumData.bilans.toString().includes("-")
              ? "#F03A30"
              : "#22E650",
            color: "#fff",
          }}
        >
          <p>
            <strong>Bilans</strong>
          </p>
          <h2>${sumData.bilans}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Przychody</strong>
          </p>
          <h2>${sumData.income}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Wydatki</strong>
          </p>
          <h2>${sumData.expenses}</h2>
        </div>
      </div>
      <div className={style.reports}>
        {timeScope === "Tydzień" && (
          <>
            <ResponsiveBar
              data={generalResults}
              keys={["Wydatki", "Przychody"]}
              indexBy="x"
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "inherit",
                  color: "#38bcb2",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "patternLines",
                  background: "inherit",
                  color: "#eed312",
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: "fries",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "sandwich",
                  },
                  id: "lines",
                },
              ]}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "country",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "food",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                e.id + ": " + e.formattedValue + " in country: " + e.indexValue
              }
            />
            <div className={style.bilandBox}>
              <ResponsiveLine
                data={generalData}
                colors={["#ff0000"]}
                margin={{ top: 160, right: 140, bottom: 120, left: 140 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                curve="basis"
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                enableCrosshair={false}
                useMesh={false}
              />
            </div>
          </>
        )}
        {timeScope === "Miesiąc" && (
          <>
            {" "}
            <ResponsiveBar
              data={generalResults}
              keys={["Wydatki", "Przychody"]}
              indexBy="x"
              margin={{ top: 50, right: 50, bottom: 60, left: 50 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 52,
                tickValues: "every 4 days",
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Zł",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                e.id + ": " + e.formattedValue + " in country: " + e.indexValue
              }
            />
            <div className={style.bilandBox}>
              <ResponsiveLine
                data={generalData}
                colors={["#ff0000"]}
                margin={{ top: 160, right: 65, bottom: 120, left: 65 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                curve="basis"
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                enableCrosshair={false}
                useMesh={false}
              />
            </div>
          </>
        )}
        {timeScope === "Rok" && (
          <>
            <ResponsiveBar
              data={generalResults}
              keys={["Wydatki", "Przychody"]}
              indexBy="x"
              margin={{ top: 50, right: 50, bottom: 60, left: 50 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 52,
                tickValues: "every 4 days",
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Zł",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                e.id + ": " + e.formattedValue + " in country: " + e.indexValue
              }
            />
            <div className={style.bilandBox}>
              <ResponsiveLine
                data={generalData}
                colors={["#ff0000"]}
                margin={{ top: 160, right: 80, bottom: 140, left: 100 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                curve="basis"
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                enableCrosshair={false}
                useMesh={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GeneralRaport;
