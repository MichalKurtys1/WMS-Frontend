import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { dateToPolish } from "../../utils/dateFormatters";
import { GET_ORDERS } from "../../utils/apollo/apolloQueries";
import {
  DELETE_ORDER,
  UPDATE_ORDER_STATE,
} from "../../utils/apollo/apolloMutations";

import style from "./OrdersPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { getAuth } from "../../context";

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const [id, setId] = useState();
  const [action, setAction] = useState();
  const { position } = getAuth();

  const { data, refetch, loading } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateOrdersState] = useMutation(UPDATE_ORDER_STATE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  const updateStateHandler = (id, action) => {
    if (action === "Do wysyłki") {
      navigate("/orders/shipping", {
        state: {
          deliveryId: id,
        },
      });
    } else if (action === "Dostarczono") {
      navigate("/orders/upload", {
        state: {
          deliveryId: id,
        },
      });
    } else {
      setStatePopupIsOpen(true);
      setId(id);
      setAction(action);
    }
  };

  const updateState = () => {
    updateOrdersState({
      variables: {
        updateOrderStateId: id,
        state: action,
      },
    }).then((data) => {
      if (!data.data) return;
      refetch();
    });
    setStatePopupIsOpen(false);
  };

  const deleteHandler = () => {
    setPopupIsOpen(false);

    deleteOrder({
      variables: {
        deleteOrderId: selectedRow,
      },
    }).then((data) => {
      if (!data.data) return;
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        refetch();
      }, 2000);
    });
  };

  const editHandler = (id) => {
    navigate(`/orders/edit`, {
      state: {
        orderId: id,
      },
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
        <div className={style.returnBox} onClick={() => navigate("/")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {successMsg && (
        <div className={style.succes}>
          <p>Zamówienie usunięte pomyślnie</p>
        </div>
      )}
      {loading && !error && <Spinner />}
      {data && data.orders && (
        <main>
          <div className={style.optionPanel}>
            <h1>Zamówienia</h1>
            {position !== "Magazynier" && (
              <div
                className={style.addOption}
                onClick={() => navigate(`/orders/add`)}
              >
                <FaUserPlus className={style.icon} />
                <p>Dodaj nowe</p>
              </div>
            )}
          </div>
          <div className={style.tableBox}>
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
              updateStateHandler={updateStateHandler}
              data={data.orders.map((item) => {
                return {
                  ...item,
                  expectedDate: dateToPolish(item.expectedDate),
                  client: item.client.name,
                };
              })}
              format={["client", "warehouse", "expectedDate", "date", "state"]}
              titles={[
                "Klient",
                "Magazyn",
                "Przewidywany termin",
                "Termin",
                "Stan",
              ]}
              allowExpand={true}
              type="Orders"
              position={position === "Magazynier" ? false : true}
            />
          </div>
        </main>
      )}
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczone zamówienie z systemu?"
          }
          button2={"Usuń"}
          button1={"Anuluj"}
          button1Action={() => setPopupIsOpen(false)}
          button2Action={deleteHandler}
        />
      )}
      {statePopupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że tego chcesz? Tego procesu nie da się odwrócić."
          }
          button2={"Potwierdź"}
          button1={"Anuluj"}
          button1Action={() => {
            setStatePopupIsOpen(false);
          }}
          button2Action={updateState}
        />
      )}
    </div>
  );
};

export default OrdersPage;
