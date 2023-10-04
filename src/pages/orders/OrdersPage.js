import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { dateToPolish } from "../../utils/dateFormatters";
import { GET_ORDERS, GET_STOCKS } from "../../utils/apollo/apolloQueries";
import {
  DELETE_ORDER,
  UPDATE_ORDER_STATE,
  UPDATE_ORDER_TRANSPORTTYPE,
} from "../../utils/apollo/apolloMutations";

import style from "./OrdersPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft, FaCheck } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { getAuth } from "../../context";
import ShipmentPopup from "./ShipmentPopup";

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const [shipmentPopupOpen, setShipmentPopupOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const [id, setId] = useState();
  const [action, setAction] = useState();
  const { position } = getAuth();
  const { data, refetch, loading } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: stocks, loading: loadingStocks } = useQuery(GET_STOCKS, {
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
  const [updateOrdersTransportType] = useMutation(UPDATE_ORDER_TRANSPORTTYPE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  const updateStateHandler = (id, action) => {
    if (action === "Potwierdzono") {
      setShipmentPopupOpen(true);
      setId(id);
    } else if (action === "Odebrano") {
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

  const transportTypeHandler = (type) => {
    setShipmentPopupOpen(false);
    if (type === "personal") {
      updateOrdersTransportType({
        variables: {
          updateOrderTrasportTypeId: id,
          transportType: type,
        },
      });
    } else {
      updateOrdersTransportType({
        variables: {
          updateOrderTrasportTypeId: id,
          transportType: type,
        },
      });
    }
    updateOrdersState({
      variables: {
        updateOrderStateId: id,
        state: "Potwierdzono",
      },
    }).then((data) => {
      if (!data.data) return;
      refetch();
    });
  };

  const generateRandomString = (length) => {
    const characters = "0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  const openPicklist = (id, products) => {
    const picklist = {
      createDate: new Date().getTime(),
      picklistID: generateRandomString(8),
      orders: [
        {
          orderID: data.orders.find((order) => order.id === id).orderID,
          orderDate: data.orders.find((order) => order.id === id).expectedDate,
          products: JSON.parse(JSON.parse(products)).map((item) => {
            const stock = stocks.stocks.find(
              (stock) =>
                item.product.includes(stock.product.name) &&
                item.product.includes(stock.product.type) &&
                item.product.includes(stock.product.capacity)
            );
            return {
              productCode: stock.code,
              productQuantity: item.quantity,
              productUnit: item.unit,
              productName: item.product,
            };
          }),
        },
      ],
    };

    console.log(picklist);

    const serializedDelivery = JSON.stringify(picklist);
    localStorage.setItem("picklistData", serializedDelivery);
    window.open("http://localhost:3000/pdf/picklist", "_blank", "noreferrer");

    navigate("/orders", {
      state: {
        userData: data.data,
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
          <FaCheck className={style.checkIcon} />
          <p>Zamówienie usunięte pomyślnie</p>
        </div>
      )}
      {(loading || loadingStocks) && !error && <Spinner />}
      {data && data.orders && !shipmentPopupOpen && (
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
                  date: item.date ? dateToPolish(item.date) : "-",
                  expectedDate: dateToPolish(item.expectedDate),
                  client: item.client.name,
                };
              })}
              format={["orderID", "client", "expectedDate", "date", "state"]}
              titles={["ID", "Klient", "Przewidywany termin", "Termin", "Stan"]}
              allowExpand={true}
              type="Orders"
              position={position === "Magazynier" ? false : true}
              openPicklist={openPicklist}
            />
          </div>
        </main>
      )}
      <ShipmentPopup
        shipmentPopupOpen={shipmentPopupOpen}
        transportTypeHandler={transportTypeHandler}
      />
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
