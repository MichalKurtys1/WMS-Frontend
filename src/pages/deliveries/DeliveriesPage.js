import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DELIVERIES } from "../../utils/apollo/apolloQueries";
import {
  DELETE_DELIVERY,
  UPDATE_DELIVERY_STATE,
  UPDATE_DELIVERY_VALUES,
} from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import { FaUserPlus } from "react-icons/fa";
import { dateToPolish } from "../../utils/dateFormatters";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context";
import Header from "../../components/Header";
import DeletePopup from "../../components/DeletePopup";
import SuccessMsg from "../../components/SuccessMsg";
import Loading from "../../components/Loading";
import StatePopup from "../../components/StatePopup";
import RefreshBtn from "../../components/RefreshBtn";

const format = ["supplier", "expectedDate", "date", "totalPrice", "state"];

const titles = ["Dostawca", "Przewidywany termin", "Termin", "Cena", "Stan"];

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
  const [totalPriceAcces] = useState(
    position === "Menadżder" || position === "Admin" || position === "Księgowy"
      ? true
      : false
  );
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
        refetch();
        navigate(location.pathname, {});
      });
    }
  }, [
    updateDeliveryValues,
    location.state,
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
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <SuccessMsg
        msg={"Dostawa usunięta pomyślnie"}
        state={successMsg && !error}
      />
      <Loading state={loading && !error} />
      {data && data.deliveries && (
        <main>
          <div className={style.optionPanel}>
            <div className={style.header}>
              <h1>Dostawy</h1>
              <RefreshBtn refetch={refetch} />
            </div>
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
                  date: item.date ? dateToPolish(item.date) : "-",
                  expectedDate: dateToPolish(item.expectedDate),
                  supplier: item.supplier.name,
                  totalPrice: item.totalPrice.toFixed(0) + " zł",
                };
              })}
              format={
                totalPriceAcces
                  ? format
                  : format.filter((x) => x !== "totalPrice")
              }
              titles={
                totalPriceAcces ? titles : titles.filter((x) => x !== "Cena")
              }
              allowExpand={true}
              type={"Delivery"}
              position={position === "Magazynier" ? false : true}
            />
          </div>
        </main>
      )}
      <DeletePopup
        refuseAction={() => setdeletePopupIsOpen(false)}
        confirmAction={deleteHandler}
        state={deletePopupIsOpen}
      />
      <StatePopup
        refuseAction={() => setStatePopupIsOpen(false)}
        confirmAction={updateState}
        state={statePopupIsOpen}
      />
    </div>
  );
};

export default DeliveriesPage;
