import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTS } from "../../utils/apollo/apolloQueries";
import { DELETE_CLIENT } from "../../utils/apollo/apolloMutations";

import style from "./ClientsPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft, FaCheck } from "react-icons/fa";
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
    onCompleted: () => setError(false),
  });
  const [deleteClient] = useMutation(DELETE_CLIENT, {
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

    deleteClient({
      variables: {
        deleteClientId: selectedRow,
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
    navigate(`/clients/edit`, {
      state: {
        clientId: id,
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
      {loading && <Spinner />}
      {successMsg && !error && (
        <div className={style.succes}>
          <FaCheck className={style.checkIcon} />
          <p>Klient usunięty pomyślnie</p>
        </div>
      )}
      {data && data.clients && (
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
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
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
          </div>
        </main>
      )}
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczonego klienta z systemu?"
          }
          button1={"Anuluj"}
          button2={"Usuń"}
          button1Action={() => setPopupIsOpen(false)}
          button2Action={deleteHandler}
        />
      )}
    </div>
  );
};

export default ClientsPage;
