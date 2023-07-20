import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DELIVERIES } from "../../utils/apollo/apolloQueries";
import {
  DELETE_DELIVERY,
  GET_DELIVERY,
} from "../../utils/apollo/apolloMutations";

import style from "./DeliveriesPage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import { dateToPolish } from "../../utils/dateFormatters";

const DeliveriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch } = useQuery(GET_DELIVERIES);
  const [deleteDeliveries] = useMutation(DELETE_DELIVERY);
  const [getDelivery] = useMutation(GET_DELIVERY);

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

  const declinedDeleteHandler = () => {
    setPopupIsOpen(false);
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
        navigate("/main/deliveries/details", {
          state: {
            details: true,
            supplierId: data.data.getDelivery.supplier.name,
            date: dateToPolish(data.data.getDelivery.date),
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
          {data && data !== null && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.deliveries.map((item) => {
                return {
                  ...item,
                  date: dateToPolish(item.date),
                  supplier: item.supplier.name,
                };
              })}
              format={["supplier", "date", "warehouse", "comments", "state"]}
              titles={["Dostawca", "Termin", "Magazyn", "Uwagi", "Stan"]}
            />
          )}
        </div>
      </main>
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczonego klienta z systemu?"
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

export default DeliveriesPage;
