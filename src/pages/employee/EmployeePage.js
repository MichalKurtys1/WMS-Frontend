import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EMPLOYYES } from "../../utils/apollo/apolloQueries";
import { DELETE_EMPLOYYE } from "../../utils/apollo/apolloMutations";

import style from "./EmployeePage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft, FaCheck } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { getAuth } from "../../context";

const EmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { position } = getAuth();
  const { data, refetch, loading } = useQuery(GET_EMPLOYYES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteEmployye] = useMutation(DELETE_EMPLOYYE, {
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

    deleteEmployye({
      variables: {
        deleteUserId: selectedRow,
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
    navigate(`/employees/edit`, {
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
      {loading && <Spinner />}
      {successMsg && !error && (
        <div className={style.succes}>
          <FaCheck className={style.checkIcon} />
          <p>Pracownik usunięty pomyślnie</p>
        </div>
      )}
      {data && data.users && (
        <main>
          <div className={style.optionPanel}>
            <h1>Pracownicy</h1>
            {position !== "Księgowy" && (
              <div
                className={style.addOption}
                onClick={() => navigate(`/employees/add`)}
              >
                <FaUserPlus className={style.icon} />
                <p>Dodawanie pracownika</p>
              </div>
            )}
          </div>
          <div className={style.tableBox}>
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
              data={data.users}
              format={["firstname", "lastname", "phone", "email", "position"]}
              titles={["Imię", "Nazwisko", "Telefon", "E-mail", "Stanowisko"]}
              details={false}
            />
          </div>
        </main>
      )}
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć zaznaczonego pracownika z systemu?"
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

export default EmployeePage;
