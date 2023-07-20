import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SUPPLIERS } from "../../utils/apollo/apolloQueries";
import { DELETE_SUPPLIER } from "../../utils/apollo/apolloMutations";

import style from "./SuppliersPage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";

const SuppliersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch } = useQuery(GET_SUPPLIERS);
  const [deleteSupplier] = useMutation(DELETE_SUPPLIER);

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

    deleteSupplier({
      variables: {
        deleteSupplierId: selectedRow,
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
    navigate(`/main/suppliers/edit`, {
      state: {
        supplierId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/main/suppliers/details`, {
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
          <p>Dostawca usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Dostawcy</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/main/suppliers/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodawanie dostawcy</p>
          </div>
        </div>
        <div className={style.tableBox}>
          {data && data !== null && (
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              detailsHandler={detailsHandler}
              messageHandler={messageHandler}
              deleteHandler={deleteHandler}
              selectedRowHandler={selectedRowHandler}
              data={data.suppliers}
              format={["name", "phone", "email", "city", "street", "number"]}
              titles={[
                "Nazwa",
                "Telefon",
                "E-mail",
                "Miejscowość",
                "Ulica",
                "Numer",
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

export default SuppliersPage;
