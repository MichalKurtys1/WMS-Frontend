import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import OperationsList from "./OperationsList";
import {
  GET_DELIVERIES,
  GET_OPERATIONS,
  GET_ORDERS,
  GET_TRANSFERS,
} from "../../utils/apollo/apolloQueries";

import style from "./OperationsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";

const OperationsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(2);
  const [currentData, setCurrentData] = useState();
  const { data, refetch: refetchDeliveries } = useQuery(GET_DELIVERIES);
  const { data: orders, refetch: refetchOrders } = useQuery(GET_ORDERS);
  const { data: transfers, refetch: refetchTransfers } =
    useQuery(GET_TRANSFERS);
  const { data: operations, refetch: refetchOperations } =
    useQuery(GET_OPERATIONS);

  useEffect(() => {
    refetchDeliveries();
    refetchOperations();
    refetchTransfers();
    refetchOrders();
  }, [refetchDeliveries, refetchOperations, refetchOrders, refetchTransfers]);

  useEffect(() => {
    if (data && orders && transfers) {
      const dataArray = [
        ...data.deliveries,
        ...orders.orders,
        ...transfers.transfers,
      ];
      console.log(dataArray);
      if (currentPage === 2) {
        setCurrentData(dataArray.filter((item) => item.state === "Zlecone"));
      } else if (currentPage === 1) {
        setCurrentData(dataArray.filter((item) => item.state === "W trakcie"));
      } else if (currentPage === 3) {
        setCurrentData(dataArray.filter((item) => item.state === "Zakończone"));
      }
    }
  }, [currentPage, data, orders, transfers]);

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <div className={style.returnBox} onClick={() => navigate("/main")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <div className={style.operationsContainer}>
        <h1>Operacje</h1>
        <div className={style.menu}>
          <p
            className={currentPage === 1 ? style.active : ""}
            onClick={() => setCurrentPage(1)}
          >
            W trkacie
          </p>
          <p
            className={currentPage === 2 ? style.active : ""}
            onClick={() => setCurrentPage(2)}
          >
            Zlecone operacje
          </p>
          <p
            className={currentPage === 3 ? style.active : ""}
            onClick={() => setCurrentPage(3)}
          >
            Zakończone
          </p>
        </div>
      </div>
      {data && (
        <OperationsList
          data={currentData}
          currentPage={currentPage}
          operations={operations}
        />
      )}
    </div>
  );
};

export default OperationsPage;
