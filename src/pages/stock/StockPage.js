import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STOCKS } from "../../utils/apollo/apolloQueries";

import style from "./StockPage.module.css";
import Table from "../../components/table/Table";
import { FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const StockPage = () => {
  const navigate = useNavigate();
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
      <ErrorHandler error={error} />
      {loading && <Spinner />}
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
                "supplier",
                "product",
                "totalQuantity",
                "availableStock",
                "ordered",
              ]}
              titles={["Dostawca", "Produkt", "Razem", "Dostępne", "Zamówiono"]}
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
