import { patternDotsDef, patternLinesDef } from "@nivo/core";
import style from "../raports/StockRaport.module.css";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_DELIVERIES,
  GET_ORDERS,
  GET_STOCKS,
} from "../../utils/apollo/apolloQueries";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import chroma from "chroma-js";
import { ResponsiveBar } from "@nivo/bar";

const StockRaport = ({ timeScope }) => {
  const [error, setError] = useState();
  const [results, setResults] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [countedData, setCountedData] = useState({
    startedOrders: 0,
    startedDeliveries: 0,
    duringOrders: 0,
    duringDeliveries: 0,
    finishedOrders: 0,
    finishedDeliveries: 0,
  });
  const { data: stocks, loading } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: orders } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: deliveries } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  const stockDataHandler = () => {
    const results = stocks.stocks.map((item, i) => {
      let scale = chroma.scale(["#E5EAFF", "#B2C1FF", "#8097FF", "#3054F2"]);
      const randomColor = scale(i * 0.15).hex();
      const productName =
        item.product.name +
        " " +
        item.product.type +
        " " +
        item.product.capacity +
        " ";
      const objects = [
        {
          id: productName,
          value: item.totalQuantity,
          idColor: randomColor,
        },
        {
          id: productName + "- Dostępne",
          value: item.availableStock,
          idColor: randomColor,
        },
        {
          id: productName + "- Zamówione",
          value: item.ordered,
          idColor: randomColor,
        },
      ];
      return objects;
    });

    setResults(results.flat(1));
  };

  const dataCountingHandler = () => {
    let tempData = {
      startedOrders: 0,
      startedDeliveries: 0,
      duringOrders: 0,
      duringDeliveries: 0,
      finishedOrders: 0,
      finishedDeliveries: 0,
    };
    orders.orders.forEach((element) => {
      if (element.state === "Zamówiono") {
        tempData.startedOrders += 1;
      } else if (element.state === "Zakończono") {
        tempData.finishedOrders += 1;
      } else {
        tempData.duringOrders += 1;
      }
    });

    deliveries.deliveries.forEach((element) => {
      if (element.state === "Zamówiono") {
        tempData.startedDeliveries += 1;
      } else if (element.state === "Zakończono") {
        tempData.finishedDeliveries += 1;
      } else {
        tempData.duringDeliveries += 1;
      }
    });

    setCountedData(tempData);
  };

  const productsBilansHandler = () => {
    let tempData = stocks.stocks.map((item) => {
      const productName =
        item.product.name +
        " " +
        item.product.type +
        " " +
        item.product.capacity;
      return {
        product: productName,
        Dostarczone: 0,
        Wysłane: 0,
        Bilans: 0,
      };
    });

    let currentDate;
    let sevenDaysAgo;
    if (timeScope === "Tydzień") {
      currentDate = new Date();
      sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
    } else if (timeScope === "Miesiąc") {
      currentDate = new Date().getMonth() + 1;
    } else {
      currentDate = new Date().getFullYear();
    }

    orders.orders.forEach((element) => {
      const products = JSON.parse(JSON.parse(element.products));
      let orderDate;
      if (element.state === "Zakończono") {
        if (timeScope === "Tydzień") {
          orderDate = new Date(+element.date);
          console.log(orderDate);
          if (orderDate >= sevenDaysAgo && orderDate <= currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Wysłane += +item.quantity;
              }
            });
          }
        } else if (timeScope === "Miesiąc") {
          orderDate = new Date(+element.date).getMonth() + 1;
          if (orderDate === currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Wysłane += +item.quantity;
              }
            });
          }
        } else {
          orderDate = new Date(+element.date).getFullYear();
          if (orderDate === currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Wysłane += +item.quantity;
              }
            });
          }
        }
      }
    });

    deliveries.deliveries.forEach((element) => {
      const products = JSON.parse(JSON.parse(element.products));
      let deliveryDate;
      if (element.state === "Zakończono") {
        if (timeScope === "Tydzień") {
          deliveryDate = new Date(+element.date);
          if (deliveryDate >= sevenDaysAgo && deliveryDate <= currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Dostarczone += +item.quantity;
              }
            });
          }
        } else if (timeScope === "Miesiąc") {
          deliveryDate = new Date(+element.date).getMonth() + 1;
          if (deliveryDate === currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Dostarczone += +item.quantity;
              }
            });
          }
        } else {
          deliveryDate = new Date(+element.date).getFullYear();
          if (deliveryDate === currentDate) {
            products.forEach((item) => {
              const foundStock = tempData.find(
                (stock) => stock.product === item.product
              );
              if (foundStock) {
                foundStock.Dostarczone += +item.quantity;
              }
            });
          }
        }
      }
    });

    setStockData(
      tempData.map((item) => {
        return {
          ...item,
          Bilans: item.Dostarczone - item.Wysłane,
        };
      })
    );
  };

  useEffect(() => {
    if (stocks && orders && deliveries) {
      stockDataHandler();
      dataCountingHandler();
      productsBilansHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks, timeScope]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      {loading && <Spinner />}
      <div className={style.sumBox}>
        <div className={style.sum}>
          <p>
            <strong>Nierozpoczęte</strong>
          </p>
          <div className={style.wrapper}>
            <div className={style.leftBox}>
              <span>Dostawy</span>
              <h3>{countedData.startedDeliveries}</h3>
            </div>
            <div className={style.rightBox}>
              <span>Zamówienia</span>
              <h3>{countedData.startedOrders}</h3>
            </div>
          </div>
        </div>
        <div className={style.sum}>
          <p>
            <strong>W trakcie</strong>
          </p>
          <div className={style.wrapper}>
            <div className={style.leftBox}>
              <span>Dostawy</span>
              <h3>{countedData.duringDeliveries}</h3>
            </div>
            <div className={style.rightBox}>
              <span>Zamówienia</span>
              <h3>{countedData.duringOrders}</h3>
            </div>
          </div>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Zakończone</strong>
          </p>
          <div className={style.wrapper}>
            <div className={style.leftBox}>
              <span>Dostawy</span>
              <h3>{countedData.finishedDeliveries}</h3>
            </div>
            <div className={style.rightBox}>
              <span>Zamówienia</span>
              <h3>{countedData.finishedOrders}</h3>
            </div>
          </div>
        </div>
      </div>
      <ResponsivePie
        data={results}
        colors={results.map((key) => key["idColor"])}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          patternDotsDef("dots", {
            background: "inherit",
            color: "#f5f5f5",
          }),
          patternLinesDef("lines", {
            background: "inherit",
            color: "#f5f5f5",
          }),
        ]}
        fill={[
          { match: (item) => item.id.includes("- Dostępne"), id: "dots" },
          { match: (item) => item.id.includes("- Zamówione"), id: "lines" },
        ]}
      />
      <ResponsiveBar
        data={stockData}
        keys={["Dostarczone", "Wysłane", "Bilans"]}
        indexBy="product"
        layout="horizontal"
        margin={{ top: 50, right: 50, bottom: 50, left: 150 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "blues" }}
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
          legend: "Bilans",
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
      />
    </div>
  );
};

export default StockRaport;
