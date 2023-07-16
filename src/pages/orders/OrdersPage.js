import { useLocation, useNavigate } from "react-router";
import Table from "../../components/Table";
import style from "./OrdersPage.module.css";
import { FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PopUp from "../../components/PopUp";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaAngleLeft } from "react-icons/fa";

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

const GET_ORDER = gql`
  mutation Mutation($getOrderId: String!) {
    getOrder(id: $getOrderId) {
      id
      clientId
      client {
        id
        name
      }
      date
      warehouse
      comments
      products
      state
    }
  }
`;

const DELETE_ORDER = gql`
  mutation Mutation($deleteOrderId: String!) {
    deleteOrder(id: $deleteOrderId)
  }
`;

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch, getError } = useQuery(GET_ORDERS);
  const [deleteOrder, { deleteError }] = useMutation(DELETE_ORDER);
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

  const detailsHandler = (id) => {
    getOrder({ variables: { getOrderId: id } })
      .then((data) => {
        const products = JSON.parse(data.data.getOrder.products);
        const date = new Date(parseInt(data.data.getOrder.date));
        const formattedDate = `${date.getUTCFullYear()}-${(
          date.getUTCMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date
          .getUTCDate()
          .toString()
          .padStart(2, "0")}T${date
          .getUTCHours()
          .toString()
          .padStart(2, "0")}:${date
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}`;
        navigate("/main/orders/details", {
          state: {
            details: true,
            clientId: data.data.getOrder.client.name,
            date: formattedDate,
            warehouse: data.data.getOrder.warehouse,
            comments: data.data.getOrder.comments,
            products: products,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const messageHandler = () => {
    navigate("/main/messages");
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
      {deleteError && (
        <div className={style.error}>
          <p>Wystąpił nieoczekiwany błąd</p>
        </div>
      )}
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
                const date = new Date(parseInt(item.date));
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                };
                const polishDate = date.toLocaleString("pl-PL", options);
                return {
                  ...item,
                  date: polishDate,
                  client: item.client.name,
                };
              })}
              format={["client", "date", "warehouse", "comments", "state"]}
              titles={["Klient", "Termin", "Magazyn", "Uwagi", "Stan"]}
            />
          )}
          {getError && (
            <div className={style.error}>
              <p>Wystąpił nieoczekiwany błąd</p>
            </div>
          )}
          {data && data === null && (
            <div className={style.error}>
              <p>Wystąpił nieoczekiwany błąd</p>
            </div>
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
