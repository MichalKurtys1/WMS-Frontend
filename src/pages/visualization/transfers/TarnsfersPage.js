import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_TRANSFERS } from "../../../utils/apollo/apolloQueries";
import {
  DELETE_TRANSFER,
  GET_DELIVERY,
} from "../../../utils/apollo/apolloMutations";

import style from "./TransfersPage.module.css";
import Table from "../../../components/Table";
import PopUp from "../../../components/PopUp";
import { FaAngleLeft } from "react-icons/fa";
import { dateToPolish } from "../../../utils/dateFormatters";
import ErrorHandler from "../../../components/ErrorHandler";
import Spinner from "../../../components/Spiner";

const TransfersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_TRANSFERS, {
    onError: (error) => setError(error),
  });
  const [deleteTransfer] = useMutation(DELETE_TRANSFER, {
    onError: (error) => setError(error),
  });
  const [getDelivery] = useMutation(GET_DELIVERY, {
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
    deleteTransfer({
      variables: {
        deleteTransferId: selectedRow,
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
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => navigate("/main/visualisation")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {successMsg && (
        <div className={style.succes}>
          <p>Transfer usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Transfery</h1>
        </div>
        <div className={style.tableBox}>
          {loading && (
            <div className={style.spinnerBox}>
              <div className={style.spinner}>
                <Spinner />
              </div>
            </div>
          )}
          {data && data.transfers && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.transfers.map((item) => {
                return {
                  ...item,
                  date: dateToPolish(item.date),
                };
              })}
              format={["employee", "date", "state"]}
              titles={["Zlecone", "Termin", "Stan"]}
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

export default TransfersPage;
