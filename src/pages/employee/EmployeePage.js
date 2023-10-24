import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EMPLOYYES } from "../../utils/apollo/apolloQueries";
import { DELETE_EMPLOYYE } from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import { FaUserPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context";
import Header from "../../components/Header";
import SuccessMsg from "../../components/SuccessMsg";
import DeletePopup from "../../components/DeletePopup";
import Loading from "../../components/Loading";

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
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      <SuccessMsg
        msg={"Pracownik usunięty pomyślnie"}
        state={successMsg && !error}
      />
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
      <DeletePopup
        refuseAction={() => setPopupIsOpen(false)}
        confirmAction={deleteHandler}
        state={popupIsOpen}
      />
    </div>
  );
};

export default EmployeePage;
