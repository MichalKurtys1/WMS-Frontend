import { useState, useEffect } from "react";
import style from "../raports/OrdersRaport.module.css";
import { useQuery } from "@apollo/client";
import ErrorHandler from "../../components/ErrorHandler";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import Loading from "../../components/Loading";
import { GET_ORDERS_RAPORTS } from "../../utils/apollo/apolloMultipleQueries";

const OrdersRaport = ({ timeScope }) => {
  const [ordersResults, setOrdersResults] = useState([]);
  const [clientsResults, setClientsResults] = useState([]);
  const [ordersData, setOrdersData] = useState({
    earned: 0,
    sum: 0,
    avg: 0,
  });
  const [error, setError] = useState();
  const { data: ordersRaports, loading } = useQuery(GET_ORDERS_RAPORTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (ordersRaports) {
      if (timeScope === "Tydzień") {
        const weekData = JSON.parse(ordersRaports.ordersRaport.weekData);
        setOrdersResults(weekData.ordersResults);
        setClientsResults(weekData.clientResults);
        setOrdersData({
          earned: weekData.earned,
          sum: weekData.sum,
          avg: weekData.avg,
        });
      } else if (timeScope === "Miesiąc") {
        const monthData = JSON.parse(ordersRaports.ordersRaport.monthData);
        setOrdersResults(monthData.ordersResults);
        setClientsResults(monthData.clientResults);
        setOrdersData({
          earned: monthData.earned,
          sum: monthData.sum,
          avg: monthData.avg,
        });
      } else if (timeScope === "Rok") {
        const yearData = JSON.parse(ordersRaports.ordersRaport.yearData);
        setOrdersResults(yearData.ordersResults);
        setClientsResults(yearData.clientResults);
        setOrdersData({
          earned: yearData.earned,
          sum: yearData.sum,
          avg: yearData.avg,
        });
      }
    }
  }, [ordersRaports, timeScope]);

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
            <strong>Zarobiono</strong>
          </p>
          <h2>${ordersData.earned}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Ilość zamówień</strong>
          </p>
          <h2>{ordersData.sum}</h2>
        </div>
        <div className={style.sum}>
          <p>
            <strong>Śr. Wielkość zamówień</strong>
          </p>
          <h2>{ordersData.avg}</h2>
        </div>
      </div>
      <div className={style.reports}>
        {ordersRaports &&
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
        {ordersRaports &&
          ordersResults.length > 0 &&
          timeScope === "Miesiąc" && (
            <ResponsiveLine
              data={ordersResults}
              margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
              xFormat="time:%Y-%m-%d"
              xScale={{ type: "time", format: "%Y-%m-%d" }}
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
        {ordersRaports && ordersResults.length > 0 && timeScope === "Rok" && (
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
      </div>
      <div className={style.reports}>
        {ordersRaports && clientsResults.length > 0 && (
          <ResponsiveBar
            data={clientsResults}
            keys={ordersRaports.products.map(
              (item) => item.name + " " + item.type + " " + item.capacity
            )}
            indexBy="client"
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
              legend: "Klienci",
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
    </div>
  );
};

export default OrdersRaport;
