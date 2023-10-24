import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STOCKS } from "../../utils/apollo/apolloQueries";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const StockPage = () => {
  const location = useLocation();
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    refetch();
  }, [location.state, location.pathname, refetch]);

  return (
    <div className={style.container}>
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {data && data.stocks && (
        <main>
          <div className={style.optionPanel}>
            <h1>Spis towarów</h1>
          </div>
          <div className={style.tableBox}>
            <Table
              data={data.stocks.map((item) => {
                return {
                  ...item,
                  supplier: item.product.supplier.name,
                  product:
                    item.product.name +
                    " " +
                    item.product.type +
                    " " +
                    item.product.capacity,
                };
              })}
              format={[
                "code",
                "supplier",
                "product",
                "totalQuantity",
                "availableStock",
                "ordered",
                "preOrdered",
              ]}
              titles={[
                "Kod",
                "Dostawca",
                "Produkt",
                "Razem",
                "Dostępne",
                "Zamówiono",
                "Pre Order",
              ]}
              details={false}
              options={true}
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default StockPage;
