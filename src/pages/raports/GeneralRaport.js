import { useState, useEffect } from "react";
import style from "./GeneralRaport.module.css";
import { useQuery } from "@apollo/client";
import ErrorHandler from "../../components/ErrorHandler";
import { ResponsiveBar } from "@nivo/bar";
import { IoIosWarning } from "react-icons/io";
import { BsX } from "react-icons/bs";
import Loading from "../../components/Loading";
import { GET_GENERAL_RAPORTS } from "../../utils/apollo/apolloMultipleQueries";

const GeneralRaport = ({ timeScope }) => {
  const [generalResults, setGeneralResults] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [error, setError] = useState();
  const [sumData, setSumData] = useState({
    income: 0,
    expenses: 0,
    bilans: 0,
  });
  const { data: generalRaports, loading } = useQuery(GET_GENERAL_RAPORTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (generalRaports) {
      const isExisting = generalRaports.stocks.filter(
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
  }, [generalRaports]);

  useEffect(() => {
    if (generalRaports) {
      if (timeScope === "Tydzień") {
        const weekData = JSON.parse(generalRaports.generalRaports.weekData);
        setGeneralResults(weekData.data);
        setSumData({
          bilans: weekData.bilans,
          income: weekData.income,
          expenses: weekData.expenses,
        });
      } else if (timeScope === "Miesiąc") {
        const monthData = JSON.parse(generalRaports.generalRaports.monthData);
        setGeneralResults(monthData.data);
        setSumData({
          bilans: monthData.bilans,
          income: monthData.income,
          expenses: monthData.expenses,
        });
      } else if (timeScope === "Rok") {
        const yearData = JSON.parse(generalRaports.generalRaports.yearData);
        setGeneralResults(yearData.data);
        setSumData({
          bilans: yearData.bilans,
          income: yearData.income,
          expenses: yearData.expenses,
        });
      }
    }
  }, [generalRaports, timeScope]);

  return (
    <div className={style.container}>
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
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
        )}
        {timeScope === "Miesiąc" && (
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
        )}
        {timeScope === "Rok" && (
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
        )}
      </div>
    </div>
  );
};

export default GeneralRaport;
