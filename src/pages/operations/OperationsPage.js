import { FaAngleLeft } from "react-icons/fa";
import style from "./OperationsPage.module.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";
import OperationsList from "./OperationsList";

const GETDELIVERIES = gql`
  query Query {
    deliveries {
      id
      supplierId
      date
      warehouse
      comments
      products
      state
      supplier {
        id
        name
        phone
        email
        city
        street
        number
      }
    }
  }
`;

const GET_ORDERS = gql`
  query Query {
    orders {
      id
      clientId
      client {
        id
        name
        phone
        email
        city
        street
        number
        nip
      }
      date
      warehouse
      comments
      products
      state
    }
  }
`;

const GET_OPERATIONS = gql`
  query Query {
    operations {
      id
      deliveriesId
      ordersId
      stage
      data
      delivery {
        id
        supplierId
        date
        warehouse
        comments
        products
        state
      }
      order {
        id
        clientId
        date
        warehouse
        comments
        products
        state
      }
    }
  }
`;

const OperationsPage = () => {
  const navigate = useNavigate();
  const { data, refetch: refetchDeliveries } = useQuery(GETDELIVERIES);
  const { data: orders, refetch: refetchOrders } = useQuery(GET_ORDERS);
  const { data: operations, refetch: refetchOperations } =
    useQuery(GET_OPERATIONS);
  const [currentPage, setCurrentPage] = useState(2);
  const [currentData, setCurrentData] = useState();

  useEffect(() => {
    refetchDeliveries();
    refetchOperations();
    refetchOrders();
  }, [refetchDeliveries, refetchOperations, refetchOrders]);

  useEffect(() => {
    if (data && orders) {
      const dataArray = [...data.deliveries, ...orders.orders];
      if (currentPage === 2) {
        setCurrentData(dataArray.filter((item) => item.state === "Zlecone"));
      } else if (currentPage === 1) {
        setCurrentData(dataArray.filter((item) => item.state === "W trakcie"));
      } else if (currentPage === 3) {
        setCurrentData(dataArray.filter((item) => item.state === "Zakończone"));
      }
    }
  }, [currentPage, data, orders]);

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
