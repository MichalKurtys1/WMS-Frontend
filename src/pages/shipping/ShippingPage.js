import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SHIPMENTS } from "../../utils/apollo/apolloQueries";
import {
  SHIPMENT_DELETE,
  UPDATE_SHIPMENT_STATE,
} from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import { FaPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context";
import { dateToPolish } from "../../utils/dateFormatters";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import SuccessMsg from "../../components/SuccessMsg";
import StatePopup from "../../components/StatePopup";
import DeletePopup from "../../components/DeletePopup";
import RefreshBtn from "../../components/RefreshBtn";
import { useLocation } from "react-router-dom";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const [id, setId] = useState();
  const [action, setAction] = useState();
  const { position } = getAuth();
  const [statePopupIsOpen, setStatePopupIsOpen] = useState(false);
  const { data, refetch, loading } = useQuery(GET_SHIPMENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteShipment] = useMutation(SHIPMENT_DELETE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateShipmentState] = useMutation(UPDATE_SHIPMENT_STATE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  const deleteHandler = () => {
    setPopupIsOpen(false);

    deleteShipment({
      variables: {
        deleteShipmentId: selectedRow,
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
    } else if (action === "Wysłano") {
      navigate("/shipping/add-details", {
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
    updateShipmentState({
      variables: {
        updateShipmentStateId: id,
        state: action,
      },
    }).then((data) => {
      refetch();
    });
    setStatePopupIsOpen(false);
  };

  const openPicklist = (id) => {
    const pickingList = data.shipments.find((item) => item.id === id);
    const serializedDelivery = pickingList.pickingList;
    localStorage.setItem("picklistData", serializedDelivery);
    window.open("http://localhost:3000/pdf/picklist", "_blank", "noopener");

    navigate("/shipping", {
      state: {
        userData: data.data,
      },
    });
  };

  const openWaybill = (id) => {
    const serializedShipping = data.shipments.find(
      (item) => item.id === id
    ).waybill;
    localStorage.setItem("shippingData", serializedShipping);
    window.open("http://localhost:3000/pdf/shippment", "_blank", "noopener");
  };

  return (
    <div className={style.container}>
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      <SuccessMsg
        msg={"Wysyłka usunięta pomyślnie"}
        state={successMsg && !error}
      />
      {data && data.shipments && (
        <main>
          <div className={style.optionPanel}>
            <div className={style.header}>
              <h1>Wysyłki</h1>
              <RefreshBtn refetch={refetch} />
            </div>
            <div
              className={style.addOption}
              onClick={() => navigate(`/shipping/add`)}
            >
              <FaPlus className={style.icon} />
              <p>Dodawanie wysyłki</p>
            </div>
          </div>
          <div className={style.tableBox}>
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
              updateStateHandler={updateStateHandler}
              data={data.shipments.map((item) => {
                return {
                  ...item,
                  deliveryDate: item.deliveryDate
                    ? dateToPolish(new Date(item.deliveryDate).getTime())
                    : "-",
                };
              })}
              format={[
                "employee",
                "registrationNumber",
                "deliveryDate",
                "state",
              ]}
              titles={[
                "Przewoźnik",
                "Nr. rejestracyjny",
                "Data dostarczenia",
                "Stan",
              ]}
              allowExpand={true}
              type="Shipping"
              position={position === "Przewoźnik" ? false : true}
              openPicklist={openPicklist}
              openWaybill={openWaybill}
            />
          </div>
        </main>
      )}
      <DeletePopup
        refuseAction={() => setPopupIsOpen(false)}
        confirmAction={deleteHandler}
        state={popupIsOpen}
      />
      <StatePopup
        refuseAction={() => setStatePopupIsOpen(false)}
        confirmAction={updateState}
        state={statePopupIsOpen}
      />
    </div>
  );
};

export default ShippingPage;
