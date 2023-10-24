import style from "../raports/DeliveriesRaport.module.css";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_DELIVERIES,
  GET_PRODUCTS,
  GET_SUPPLIERS,
} from "../../utils/apollo/apolloQueries";
import ErrorHandler from "../../components/ErrorHandler";
import { useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import Loading from "../../components/Loading";

const DeliveriesRaport = ({ timeScope }) => {
  const [ordersResults, setOrdersResults] = useState([]);
  const [clientsResults, setClientsResults] = useState([]);
  const [ordersData, setOrdersData] = useState({
    earned: 0,
    earnedIncr: 0,
    sum: 0,
    sumIncr: 0,
    avg: 0,
    avgIncr: 0,
  });
  const [error, setError] = useState();
  const { data, loading } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: products } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: suppliers } = useQuery(GET_SUPPLIERS, {
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
    let results = suppliers.suppliers.map((item) => {
      return { suppliers: item.name };
    });

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
      y: 0,
      z: day.date,
      v: 0,
    }));

    let sum = 0;
    let avg = 0;
    let earned = 0;

    data.deliveries.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = initialData.find(
        (dataPoint) => dataPoint.z === orderDate
      );

      if (matchingDataPoint) {
        const prods = JSON.parse(JSON.parse(order.products));
        const res = results.find(
          (item) => item.suppliers === order.supplier.name
        );

        prods.forEach((element) => {
          if (res[element.product]) {
            res[element.product] += +element.quantity;
          } else {
            res[element.product] = +element.quantity;
          }
          avg += +element.quantity;
        });

        earned += order.totalPrice;
        matchingDataPoint.y += 1;
        matchingDataPoint.v += +order.totalPrice.toFixed(0);
        sum++;
      }
    });

    setOrdersData({
      ...ordersData,
      sum: sum,
      avg: (avg / sum).toFixed(0),
      earned: earned.toFixed(0),
    });
    setClientsResults(results);
    setOrdersResults([{ id: "orders", data: initialData }]);
  };

  const monthOrdersCountHandler = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dataArray = [];
    let results = suppliers.suppliers.map((item) => {
      return { suppliers: item.name };
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      dataArray.push({
        x: formattedDate,
        y: 0,
        v: 0,
      });
    }

    let sum = 0;
    let avg = 0;
    let earned = 0;

    data.deliveries.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().split("T")[0];
      const matchingDataPoint = dataArray.find(
        (dataPoint) => dataPoint.x === orderDate
      );

      if (matchingDataPoint) {
        const prods = JSON.parse(JSON.parse(order.products));
        const res = results.find(
          (item) => item.suppliers === order.supplier.name
        );

        prods.forEach((element) => {
          if (res[element.product]) {
            res[element.product] += +element.quantity;
          } else {
            res[element.product] = +element.quantity;
          }
          avg += +element.quantity;
        });

        earned += order.totalPrice;
        matchingDataPoint.y += 1;
        matchingDataPoint.v += +order.totalPrice.toFixed(0);
        sum++;
      }
    });

    setOrdersData({
      ...ordersData,
      sum: sum,
      avg: (avg / sum).toFixed(0),
      earned: earned.toFixed(0),
    });
    setClientsResults(results);
    setOrdersResults([{ id: "orders", data: dataArray }]);
  };

  const yearOrdersCountHandler = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const months = [];
    let results = suppliers.suppliers.map((item) => {
      return { suppliers: item.name };
    });

    for (let month = 0; month < 12; month++) {
      months.push({
        x: `${currentYear}-${month + 1 < 10 ? "0" : ""}${month + 1}`,
        y: 0,
        v: 0,
      });
    }

    let sum = 0;
    let avg = 0;
    let earned = 0;

    data.deliveries.forEach((order) => {
      const orderDate = new Date(+order.date).toISOString().slice(0, 7);
      const matchingDataPoint = months.find(
        (dataPoint) => dataPoint.x === orderDate
      );

      if (matchingDataPoint) {
        const prods = JSON.parse(JSON.parse(order.products));
        const res = results.find(
          (item) => item.suppliers === order.supplier.name
        );

        prods.forEach((element) => {
          if (res[element.product]) {
            res[element.product] += +element.quantity;
          } else {
            res[element.product] = +element.quantity;
          }
          avg += +element.quantity;
        });

        earned += order.totalPrice;
        matchingDataPoint.y += 1;
        matchingDataPoint.v += +order.totalPrice.toFixed(0);
        sum++;
      }
    });

    setOrdersData({
      ...ordersData,
      sum: sum,
      avg: (avg / sum).toFixed(0),
      earned: earned.toFixed(0),
    });
    setClientsResults(results);
    setOrdersResults([{ id: "orders", data: months }]);
  };

  useEffect(() => {
    if (data && products && suppliers) {
      if (timeScope === "Tydzień") {
        weekOrdersCountHandler();
      } else if (timeScope === "Miesiąc") {
        monthOrdersCountHandler();
      } else if (timeScope === "Rok") {
        yearOrdersCountHandler();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, timeScope, products, suppliers]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      <div className={style.sumBox}>
        <div
          className={style.sum}
          style={{ backgroundColor: "#3054F2", color: "#fff" }}
        >
          <p>
            <strong>Wydano</strong>
          </p>
          <h2>${ordersData.earned}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Ilość dostaw</strong>
          </p>
          <h2>{ordersData.sum}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Śr. Wielkość dostaw</strong>
          </p>
          <h2>{ordersData.avg}</h2>
        </div>
      </div>
      {data &&
        suppliers &&
        products &&
        ordersResults.length > 0 &&
        timeScope === "Tydzień" && (
          <ResponsiveLine
            data={ordersResults}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Dzień tygodnia",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Ilość",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={7}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
            curve={"monotoneX"}
            tooltip={({ point }) => {
              return (
                <div className={style.tooltip}>
                  <div
                    className={style.color}
                    style={{ backgroundColor: point.serieColor }}
                  ></div>
                  <div>
                    {point.data.x}: <strong>{point.data.y}</strong>
                  </div>
                  <div className={style.earned}>
                    <p>
                      <strong>${point.data.v}</strong>
                    </p>
                  </div>
                </div>
              );
            }}
          />
        )}
      {data &&
        suppliers &&
        products &&
        ordersResults.length > 0 &&
        timeScope === "Miesiąc" && (
          <ResponsiveLine
            data={ordersResults}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            xFormat="time:%Y-%m-%d"
            xScale={{ type: "time", format: "%Y-%m-%d" }}
            yFormat=" >-.2f"
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              format: "%Y-%m-%d",
              legendOffset: -60,
              tickValues: "every 4 days",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Ilość",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={7}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
            curve={"monotoneX"}
            tooltip={({ point }) => {
              return (
                <div className={style.tooltip}>
                  <div
                    className={style.color}
                    style={{ backgroundColor: point.serieColor }}
                  ></div>
                  <div>
                    {point.data.xFormatted}: <strong>{point.data.y}</strong>
                  </div>
                  <div className={style.earned}>
                    <p>
                      <strong>${point.data.v}</strong>
                    </p>
                  </div>
                </div>
              );
            }}
          />
        )}
      {data &&
        suppliers &&
        products &&
        ordersResults.length > 0 &&
        timeScope === "Rok" && (
          <ResponsiveLine
            data={ordersResults}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            xFormat="time:%Y-%m"
            xScale={{ type: "time", format: "%Y-%m" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              format: "%Y-%m",
              legendOffset: -60,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Ilość",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={7}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
            curve={"monotoneX"}
            tooltip={({ point }) => {
              return (
                <div className={style.tooltip}>
                  <div
                    className={style.color}
                    style={{ backgroundColor: point.serieColor }}
                  ></div>
                  <div>
                    {point.data.xFormatted}: <strong>{point.data.y}</strong>
                  </div>
                  <div className={style.earned}>
                    <p>
                      <strong>${point.data.v}</strong>
                    </p>
                  </div>
                </div>
              );
            }}
          />
        )}

      {data && suppliers && products && clientsResults.length > 0 && (
        <ResponsiveBar
          data={clientsResults}
          keys={products.products.map(
            (item) => item.name + " " + item.type + " " + item.capacity
          )}
          indexBy="suppliers"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "blues" }}
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
            legend: "Dostawcy",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Produkty",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default DeliveriesRaport;
