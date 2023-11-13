import { patternDotsDef, patternLinesDef } from "@nivo/core";
import style from "../raports/StockRaport.module.css";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ErrorHandler from "../../components/ErrorHandler";
import { ResponsiveBar } from "@nivo/bar";
import Loading from "../../components/Loading";
import { GET_STOCK_RAPORTS } from "../../utils/apollo/apolloMultipleQueries";

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
  const { data: stockRaports, loading } = useQuery(GET_STOCK_RAPORTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (stockRaports) {
      setCountedData(JSON.parse(stockRaports.stockRaport.operationsData));
      setResults(JSON.parse(stockRaports.stockRaport.generalData));
      if (timeScope === "Tydzień") {
        const weekData = JSON.parse(stockRaports.stockRaport.weekData);
        setStockData(weekData);
      } else if (timeScope === "Miesiąc") {
        const monthData = JSON.parse(stockRaports.stockRaport.monthData);
        setStockData(monthData);
      } else if (timeScope === "Rok") {
        const yearData = JSON.parse(stockRaports.stockRaport.yearData);
        setStockData(yearData);
      }
    }
  }, [stockRaports, timeScope]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
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
      <div className={style.reports}>
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
      </div>
      <div className={style.reports}>
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
    </div>
  );
};

export default StockRaport;
