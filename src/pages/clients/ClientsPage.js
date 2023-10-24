import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTS } from "../../utils/apollo/apolloQueries";
import { DELETE_CLIENT } from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import { FaUserPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import DeletePopup from "../../components/DeletePopup";
import SuccessMsg from "../../components/SuccessMsg";
import Loading from "../../components/Loading";

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
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={loading} />
      <SuccessMsg
        msg={"Klient usunięty pomyślnie"}
        state={successMsg && !error}
      />
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
      <DeletePopup
        refuseAction={() => setPopupIsOpen(false)}
        confirmAction={deleteHandler}
        state={popupIsOpen}
      />
    </div>
  );
};

export default ClientsPage;
