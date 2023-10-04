import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SUPPLIERS } from "../../utils/apollo/apolloQueries";
import { DELETE_SUPPLIER } from "../../utils/apollo/apolloMutations";

import style from "./SuppliersPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft, FaCheck } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";

const SuppliersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_SUPPLIERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteSupplier] = useMutation(DELETE_SUPPLIER, {
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

    deleteSupplier({
      variables: {
        deleteSupplierId: selectedRow,
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
    navigate(`/suppliers/edit`, {
      state: {
        supplierId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/suppliers/details`, {
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
        <div className={style.returnBox} onClick={() => navigate("/")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {successMsg && !error && (
        <div className={style.succes}>
          <FaCheck className={style.checkIcon} />
          <p>Dostawca usunięty pomyślnie</p>
        </div>
      )}
      {loading && <Spinner />}
      {data && data.suppliers && (
        <main>
          <div className={style.optionPanel}>
            <h1>Dostawcy</h1>
            <div
              className={style.addOption}
              on
              onClick={() => navigate(`/suppliers/add`)}
            >
              <FaUserPlus className={style.icon} />
              <p>Dodawanie dostawcy</p>
            </div>
          </div>
          <div className={style.tableBox}>
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
              data={data.suppliers.map((item) => {
                return {
                  ...item,
                  address:
                    "ul. " + item.street + " " + item.number + " " + item.city,
                };
              })}
              details={true}
              format={["name", "phone", "email", "address", "bank"]}
              titles={["Nazwa", "Telefon", "E-mail", "Adres", "Bank"]}
            />
          </div>
        </main>
      )}
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczonego klienta z systemu?"
          }
          button2={"Usuń"}
          button1={"Anuluj"}
          button1Action={() => setPopupIsOpen(false)}
          button2Action={deleteHandler}
        />
      )}
    </div>
  );
};

export default SuppliersPage;
