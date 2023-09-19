import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ORDER_SHIPMENTS } from "../../utils/apollo/apolloQueries";
import {
  SHIPMENT_DELETE,
  UPDATE_SHIPMENT_STATE,
} from "../../utils/apollo/apolloMutations";

import style from "./ShippingPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const { data, refetch, loading } = useQuery(GET_ORDER_SHIPMENTS, {
    onError: (error) => setError(error),
  });
  const [deleteShipment] = useMutation(SHIPMENT_DELETE, {
    onError: (error) => setError(error),
  });
  const [updateShipmentState] = useMutation(UPDATE_SHIPMENT_STATE, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

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

    deleteShipment({
      variables: {
        deleteOrderShipmentId: selectedRow,
      },
    })
      .then(() => {
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
    navigate(`/shipping`, {
      state: {
        userId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/shipping`, {
      state: {
        userId: id,
      },
    });
  };

  const updateStateHandler = (id, action) => {
    if (action === "Dostarczono") {
      navigate("/shipping/upload", {
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
      updateShipmentState({
        variables: {
          updateOrderShipmentStateId: id,
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
  }, [action, id, refetch, shouldUpdateDeliveryState, updateShipmentState]);

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
          <p>Wysyłka usunięta pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Wysyłki</h1>
          <div
            className={style.addOption}
            onClick={() => navigate(`/shipping/add`)}
          >
            <FaPlus className={style.icon} />
            <p>Dodawanie wysyłki</p>
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
          {data && data.orderShipments && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              updateStateHandler={updateStateHandler}
              data={data.orderShipments}
              format={[
                "employee",
                "registrationNumber",
                "deliveryDate",
                "warehouse",
                "state",
              ]}
              titles={[
                "Przewoźnik",
                "Nr. rejestracyjny",
                "Data dostarczenia",
                "Magazyn",
                "Stan",
              ]}
              allowExpand={true}
              type="Shipping"
            />
          )}
        </div>
      </main>

      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczonego pracownika z systemu?"
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

export default ShippingPage;
