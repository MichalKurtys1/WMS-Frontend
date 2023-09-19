import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTS } from "../../utils/apollo/apolloQueries";
import { DELETE_CLIENT } from "../../utils/apollo/apolloMutations";

import style from "./ClientsPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const ClientsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_CLIENTS, {
    onError: (error) => setError(error),
  });
  const [deleteClient] = useMutation(DELETE_CLIENT, {
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

    deleteClient({
      variables: {
        deleteClientId: selectedRow,
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
    navigate(`/clients/edit`, {
      state: {
        clientId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/clients/details`, {
      state: {
        userId: id,
      },
    });
  };

  const messageHandler = () => {
    navigate("/messages");
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
          <p>Klient usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Klienci</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/clients/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodawanie klienta</p>
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
          {data && data.clients && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.clients}
              format={[
                "name",
                "phone",
                "email",
                "city",
                "street",
                "number",
                "nip",
              ]}
              titles={[
                "Nazwa",
                "Telefon",
                "E-mail",
                "Miejscowość",
                "Ulica",
                "Numer",
                "NIP",
              ]}
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

export default ClientsPage;
