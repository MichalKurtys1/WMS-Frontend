import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EMPLOYYES } from "../../utils/apollo/apolloQueries";
import { DELETE_EMPLOYYE } from "../../utils/apollo/apolloMutations";

import style from "./EmployeePage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";

const EmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch } = useQuery(GET_EMPLOYYES);
  const [deleteEmployye] = useMutation(DELETE_EMPLOYYE);

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

  const messageHandler = () => {
    navigate("/main/messages");
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
          <p>Pracownik usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Pracownicy</h1>
          <div
            className={style.addOption}
            onClick={() => navigate(`/main/employees/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodawanie pracownika</p>
          </div>
        </div>
        <div className={style.tableBox}>
          {data && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.users}
              format={[
                "firstname",
                "lastname",
                "phone",
                "email",
                "magazine",
                "position",
              ]}
              titles={[
                "Imię",
                "Nazwisko",
                "Telefon",
                "E-mail",
                "Magazyn",
                "Stanowisko",
              ]}
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

export default EmployeePage;
