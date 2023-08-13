import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ORDER_SHIPMENTS,
  GET_STOCKS,
} from "../../utils/apollo/apolloQueries";
import { DELETE_EMPLOYYE } from "../../utils/apollo/apolloMutations";

import style from "./ShippingPage.module.css";
import Table from "../../components/Table";
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
  const { data, refetch, loading } = useQuery(GET_ORDER_SHIPMENTS, {
    onError: (error) => setError(error),
  });
  const [deleteEmployye] = useMutation(DELETE_EMPLOYYE, {
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

    deleteEmployye({
      variables: {
        deleteUserId: selectedRow,
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
    navigate(`/main/employees/edit`, {
      state: {
        userId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/main/employees/details`, {
      state: {
        userId: id,
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
        <div className={style.returnBox} onClick={() => navigate("/main")}>
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
            onClick={() => navigate(`/main/shipping/add`)}
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
              data={data.orderShipments}
              format={[
                "employee",
                "registrationNumber",
                "deliveryDate",
                "warehouse",
              ]}
              titles={[
                "Przewoźnik",
                "Nr. rejestracyjny",
                "Data dostarczenia",
                "Magazyn",
              ]}
              details={false}
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
    </div>
  );
};

export default ShippingPage;
