import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DELIVERIES } from "../../utils/apollo/apolloQueries";
import {
  DELETE_DELIVERY,
  UPDATE_DELIVERY_STATE,
  UPDATE_DELIVERY_VALUES,
} from "../../utils/apollo/apolloMutations";
import style from "./DeliveriesPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import { dateToPolish } from "../../utils/dateFormatters";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { getAuth } from "../../context";

const DeliveriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState();
  const [action, setAction] = useState();
  const [deletePopupIsOpen, setdeletePopupIsOpen] = useState(false);
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { position } = getAuth();

  const { data, refetch, loading } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteDeliveries] = useMutation(DELETE_DELIVERY, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateDeliveryState] = useMutation(UPDATE_DELIVERY_STATE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateDeliveryValues] = useMutation(UPDATE_DELIVERY_VALUES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  useEffect(() => {
    if (location.state && location.state.products) {
      updateDeliveryValues({
        variables: {
          updateValuesId: location.state.deliveryId,
          products: JSON.stringify(location.state.products),
        },
      }).then((data) => {
        if (!data.data) return;
        updateDeliveryState({
          variables: {
            updateStateId: location.state.deliveryId,
            state: "Posortowano",
          },
        }).then((data) => {
          if (!data.data) return;
          refetch();
          navigate(location.pathname, {});
        });
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

  const updateStateHandler = (id, action) => {
    if (action === "Posortowano") {
      navigate("/deliveries/sorting", {
        state: {
          deliveryId: id,
        },
      });
    } else if (action === "Zakończono") {
      navigate("/deliveries/upload", {
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
    updateDeliveryState({
      variables: {
        updateStateId: id,
        state: action,
      },
    }).then((data) => {
      if (!data.data) return;
      refetch();
    });
    setStatePopupIsOpen(false);
  };

  const deleteHandler = () => {
    setdeletePopupIsOpen(false);
    deleteDeliveries({
      variables: {
        deleteDeliveryId: selectedRow,
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
    navigate(`/deliveries/edit`, {
      state: {
        deliveryId: id,
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
      {successMsg && !error && (
        <div className={style.succes}>
          <p>Dostawa usunięta pomyślnie</p>
        </div>
      )}
      {loading && !error && <Spinner />}
      {data && data.deliveries && (
        <main>
          <div className={style.optionPanel}>
            <h1>Dostawy</h1>
            {position !== "Magazynier" && (
              <div
                className={style.addOption}
                onClick={() => navigate(`/deliveries/add`)}
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
              deleteHandler={() => setdeletePopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
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
              position={position === "Magazynier" ? false : true}
            />
          </div>
        </main>
      )}
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

export default DeliveriesPage;
