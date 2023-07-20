import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { dateToPolish } from "../../utils/dateFormatters";
import { GET_ORDERS } from "../../utils/apollo/apolloQueries";
import { DELETE_ORDER, GET_ORDER } from "../../utils/apollo/apolloMutations";

import style from "./OrdersPage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch } = useQuery(GET_ORDERS);
  const [deleteOrder] = useMutation(DELETE_ORDER);
  const [getOrder] = useMutation(GET_ORDER);

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  const selectedRowHandler = (id) => {
    setSelectedRow(id);
  };

  const deleteHandler = (id) => {
    setPopupIsOpen(true);
  };

  const confirmedDeleteHandler = () => {
    setPopupIsOpen(false);

    deleteOrder({
      variables: {
        deleteOrderId: selectedRow,
      },
    })
      .then((data) => {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          refetch();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const declinedDeleteHandler = () => {
    setPopupIsOpen(false);
  };

  const editHandler = (id) => {
    navigate(`/main/orders/edit`, {
      state: {
        orderId: id,
      },
    });
  };

  const messageHandler = () => {
    navigate("/main/messages");
  };

  const detailsHandler = (id) => {
    getOrder({ variables: { getOrderId: id } })
      .then((data) => {
        navigate("/main/orders/details", {
          state: {
            details: true,
            clientId: data.data.getOrder.client.name,
            date: dateToPolish(data.data.getOrder.date),
            warehouse: data.data.getOrder.warehouse,
            comments: data.data.getOrder.comments,
            products: JSON.parse(data.data.getOrder.products),
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      {successMsg && (
        <div className={style.succes}>
          <p>Zamówienie usunięte pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Zamówienia</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/main/orders/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodaj nowe</p>
          </div>
        </div>
        <div className={style.tableBox}>
          {data && data !== null && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.orders.map((item) => {
                return {
                  ...item,
                  date: dateToPolish(item.date),
                  client: item.client.name,
                };
              })}
              format={["client", "date", "warehouse", "comments", "state"]}
              titles={["Klient", "Termin", "Magazyn", "Uwagi", "Stan"]}
            />
          )}
        </div>
      </main>
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczone zamówienie z systemu?"
          }
          button2={"Usuń"}
          button1={"Anuluj"}
          button1Action={declinedDeleteHandler}
          button2Action={confirmedDeleteHandler}
        />
      )}
    </div>
  );
};

export default OrdersPage;
