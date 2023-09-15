import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { dateToPolish } from "../../utils/dateFormatters";
import { GET_ORDERS } from "../../utils/apollo/apolloQueries";
import {
  DELETE_ORDER,
  GET_ORDER,
  UPDATE_ORDER_STATE,
} from "../../utils/apollo/apolloMutations";

import style from "./OrdersPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const [id, setId] = useState();
  const [action, setAction] = useState();
  // const [deletePopupIsOpen, setdeletePopupIsOpen] = useState(false);
  const [shouldUpdateDeliveryState, setShouldUpdateDeliveryState] =
    useState(false);
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const { data, refetch, loading } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
  });
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onError: (error) => setError(error),
  });
  const [getOrder] = useMutation(GET_ORDER, {
    onError: (error) => setError(error),
  });
  const [updateOrdersState] = useMutation(UPDATE_ORDER_STATE, {
    onError: (error) => setError(error),
  });

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
            client: data.data.getOrder.client,
            dateNumber: data.data.getOrder.date,
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

  // ssss

  const updateStateHandler = (id, action) => {
    if (action === "Do wysyłki") {
      navigate("/main/orders/shipping", {
        state: {
          deliveryId: id,
        },
      });
    } else if (action === "Dostarczono") {
      navigate("/main/orders/upload", {
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

  const button2ActionHandler = () => {
    setStatePopupIsOpen(false);
    setShouldUpdateDeliveryState(true);
  };

  useEffect(() => {
    if (shouldUpdateDeliveryState) {
      updateOrdersState({
        variables: {
          updateOrderStateId: id,
          state: action,
        },
      })
        .then((data) => {
          refetch();
        })
        .catch((err) => {
          console.log(err);
        });
      setShouldUpdateDeliveryState(false);
    }
  }, [action, id, refetch, shouldUpdateDeliveryState, updateOrdersState]);

  // useEffect(() => {
  //   if (location.state && location.state.products) {
  //     updateDeliveryValues({
  //       variables: {
  //         updateValuesId: location.state.deliveryId,
  //         products: JSON.stringify(location.state.products),
  //       },
  //     })
  //       .then((data) => {
  //         updateDeliveryState({
  //           variables: {
  //             updateStateId: location.state.deliveryId,
  //             state: "Posortowano",
  //           },
  //         })
  //           .then((data) => {
  //             refetch();
  //             navigate(location.pathname, {});
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [
  //   updateDeliveryValues,
  //   location.state,
  //   updateDeliveryState,
  //   location.pathname,
  //   navigate,
  //   refetch,
  // ]);

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
      <ErrorHandler error={error} />
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
          {loading && (
            <div className={style.spinnerBox}>
              <div className={style.spinner}>
                <Spinner />
              </div>
            </div>
          )}
          {data && data.orders && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
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
          button2Action={button2ActionHandler}
        />
      )}
    </div>
  );
};

export default OrdersPage;
