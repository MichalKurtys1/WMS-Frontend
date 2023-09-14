import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DELIVERIES } from "../../utils/apollo/apolloQueries";
import {
  DELETE_DELIVERY,
  GET_DELIVERY,
  UPDATE_DELIVERY_STATE,
  UPDATE_DELIVERY_VALUES,
} from "../../utils/apollo/apolloMutations";

import style from "./DeliveriesPage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import { dateToPolish } from "../../utils/dateFormatters";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const DeliveriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState();
  const [action, setAction] = useState();
  const [deletePopupIsOpen, setdeletePopupIsOpen] = useState(false);
  const [shouldUpdateDeliveryState, setShouldUpdateDeliveryState] =
    useState(false);
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
  });
  const [deleteDeliveries] = useMutation(DELETE_DELIVERY, {
    onError: (error) => setError(error),
  });
  const [getDelivery] = useMutation(GET_DELIVERY, {
    onError: (error) => setError(error),
  });
  const [updateDeliveryState] = useMutation(UPDATE_DELIVERY_STATE, {
    onError: (error) => setError(error),
  });
  const [updateDeliveryValues] = useMutation(UPDATE_DELIVERY_VALUES, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  useEffect(() => {
    if (shouldUpdateDeliveryState) {
      updateDeliveryState({
        variables: {
          updateStateId: id,
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
  }, [action, id, refetch, shouldUpdateDeliveryState, updateDeliveryState]);

  useEffect(() => {
    if (location.state && location.state.products) {
      updateDeliveryValues({
        variables: {
          updateValuesId: location.state.deliveryId,
          products: JSON.stringify(location.state.products),
        },
      })
        .then((data) => {
          updateDeliveryState({
            variables: {
              updateStateId: location.state.deliveryId,
              state: "Posortowano",
            },
          })
            .then((data) => {
              refetch();
              navigate(location.pathname, {});
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    updateDeliveryValues,
    location.state,
    updateDeliveryState,
    location.pathname,
    navigate,
    refetch,
  ]);

  const selectedRowHandler = (id) => {
    setSelectedRow(id);
  };

  const updateStateHandler = (id, action) => {
    if (action === "Posortowano") {
      navigate("/main/deliveries/sorting", {
        state: {
          deliveryId: id,
        },
      });
    } else if (action === "Zakończono") {
      console.log(id);
      navigate("/main/deliveries/upload", {
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

  const deleteHandler = (id) => {
    setdeletePopupIsOpen(true);
  };

  const confirmedDeleteHandler = () => {
    setdeletePopupIsOpen(false);
    deleteDeliveries({
      variables: {
        deleteDeliveryId: selectedRow,
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

  const editHandler = (id) => {
    navigate(`/main/deliveries/edit`, {
      state: {
        deliveryId: id,
      },
    });
  };

  const messageHandler = () => {
    navigate("/main/messages");
  };

  const detailsHandler = (id) => {
    getDelivery({ variables: { getDeliveryId: id } })
      .then((data) => {
        console.log(data.data.getDelivery.date);
        navigate("/main/deliveries/details", {
          state: {
            details: true,
            supplier: data.data.getDelivery.supplier,
            supplierId: data.data.getDelivery.supplier.name,
            dateNumber: data.data.getDelivery.date,
            warehouse: data.data.getDelivery.warehouse,
            comments: data.data.getDelivery.comments,
            products: JSON.parse(data.data.getDelivery.products),
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
      <ErrorHandler error={error} />
      {successMsg && (
        <div className={style.succes}>
          <p>Dostawa usunięta pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Dostawy</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/main/deliveries/add`)}
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
          {data && data.deliveries && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              updateStateHandler={updateStateHandler}
              data={data.deliveries.map((item) => {
                return {
                  ...item,
                  expectedDate: dateToPolish(item.expectedDate),
                  supplier: item.supplier.name,
                };
              })}
              format={[
                "supplier",
                "warehouse",
                "expectedDate",
                "date",
                "state",
              ]}
              titles={[
                "Dostawca",
                "Magazyn",
                "Przewidywany termin",
                "Termin",
                "Stan",
              ]}
              allowExpand={true}
              type={"Delivery"}
            />
          )}
        </div>
      </main>
      {deletePopupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że tego chcesz? Tego procesu nie da się odwrócić."
          }
          button2={"Usuń"}
          button1={"Anuluj"}
          button1Action={() => {
            setdeletePopupIsOpen(false);
          }}
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

export default DeliveriesPage;
