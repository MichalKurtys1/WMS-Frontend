import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SUPPLIERS } from "../../utils/apollo/apolloQueries";
import { DELETE_SUPPLIER } from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import { FaUserPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import DeletePopup from "../../components/DeletePopup";
import SuccessMsg from "../../components/SuccessMsg";
import Loading from "../../components/Loading";
import RefreshBtn from "../../components/RefreshBtn";
import { useLocation } from "react-router-dom";

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
      <Header path={"/"} />
      <ErrorHandler error={error} />
      <SuccessMsg
        msg={"Dostawca usunięty pomyślnie"}
        state={successMsg && !error}
      />
      <Loading state={loading && !error} />
      {data && data.suppliers && (
        <main>
          <div className={style.optionPanel}>
            <div className={style.header}>
              <h1>Dostawcy</h1>
              <RefreshBtn refetch={refetch} />
            </div>
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
      <DeletePopup
        refuseAction={() => setPopupIsOpen(false)}
        confirmAction={deleteHandler}
        state={popupIsOpen}
      />
    </div>
  );
};

export default SuppliersPage;
