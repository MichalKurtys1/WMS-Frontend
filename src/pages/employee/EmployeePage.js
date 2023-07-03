import { useLocation, useNavigate } from "react-router";
import Table from "../../components/Table";
import style from "./EmployeePage.module.css";
import {
  FaUserCog,
  FaUserEdit,
  FaUserPlus,
  FaUserMinus,
  FaEnvelope,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import PopUp from "../../components/PopUp";
import { gql, useMutation, useQuery } from "@apollo/client";

const GETEMPLOYYE = gql`
  query Query {
    users {
      id
      email
      password
      firstname
      lastname
      phone
      magazine
      position
      token
      firstLogin
    }
  }
`;

const DELETEEMPLOYYE = gql`
  mutation Mutation($deleteUserId: String!) {
    deleteUser(id: $deleteUserId)
  }
`;

const EmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { loading, error, data, refetch } = useQuery(GETEMPLOYYE);
  const [deleteEmployye] = useMutation(DELETEEMPLOYYE);

  useEffect(() => {
    if (location.state) {
      refetch();
    }
  }, [location.state, refetch]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const rowSelectHandler = (rowId) => {
    if (selectedRow === rowId) {
      setSelectedRow(null);
    } else {
      setSelectedRow(rowId);
    }
  };

  const deleteHandler = () => {
    if (selectedRow === null) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 3000);
    } else {
      setPopupIsOpen(true);
    }
  };

  const confirmedDeleteHandler = () => {
    setPopupIsOpen(false);

    deleteEmployye({
      variables: {
        deleteUserId: selectedRow,
      },
    })
      .then((data) => {
        setErrorMsg(false);
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

  const editHandler = () => {
    if (selectedRow === null) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 3000);
    } else {
      navigate(`/main/employees/edit`, {
        state: {
          userId: selectedRow,
        },
      });
    }
  };

  const detailsHandler = () => {
    if (selectedRow === null) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 3000);
    } else {
      navigate(`/main/employees/details`, {
        state: {
          userId: selectedRow,
        },
      });
    }
  };

  const messageHandler = () => {
    if (selectedRow === null) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 3000);
    } else {
      navigate("/main/messages");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Pracownicy</h1>
      </div>
      {errorMsg && (
        <div className={style.error}>
          <p>Trzeba zaznaczyć wiersz żeby wykonać tę akcje</p>
        </div>
      )}
      {successMsg && (
        <div className={style.succes}>
          <p>Pracownik usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <div onClick={() => navigate(`/main/employees/add`)}>
            <FaUserPlus className={style.icon} />
          </div>
          <div onClick={deleteHandler}>
            <FaUserMinus className={style.icon} />
          </div>
          <div onClick={editHandler}>
            <FaUserEdit className={style.icon} />
          </div>
          <div onClick={detailsHandler}>
            <FaUserCog className={style.icon} />
          </div>
          <div onClick={messageHandler}>
            <FaEnvelope className={style.icon} />
          </div>
        </div>
        <div className={style.tableBox}>
          {data && (
            <Table
              selectHandler={rowSelectHandler}
              selectedRow={selectedRow}
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
