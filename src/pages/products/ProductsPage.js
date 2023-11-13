import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../utils/apollo/apolloQueries";
import { DELETE_PRODUCT } from "../../utils/apollo/apolloMutations";

import style from "../styles/tablePages.module.css";
import Table from "../../components/table/Table";
import DeletePopup from "../../components/DeletePopup";
import { FaUserPlus } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import { getAuth } from "../../context/index";
import Header from "../../components/Header";
import SuccessMsg from "../../components/SuccessMsg";
import Loading from "../../components/Loading";
import RefreshBtn from "../../components/RefreshBtn";
import { useLocation } from "react-router-dom";

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { position } = getAuth();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState();
  const { data, refetch, loading } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
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

    deleteProduct({
      variables: {
        deleteProductId: selectedRow,
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
    navigate(`/products/edit`, {
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
        msg={"Produkt usunięty pomyślnie"}
        state={successMsg && !error}
      />
      <Loading state={loading && !error} />
      {data && data.products && (
        <main>
          <div className={style.optionPanel}>
            <div className={style.header}>
              <h1>Lista produktów</h1>
              <RefreshBtn refetch={refetch} />
            </div>
            {position !== "Magazynier" && (
              <div
                className={style.addOption}
                on
                onClick={() => navigate(`/products/add`)}
              >
                <FaUserPlus className={style.icon} />
                <p>Dodawanie produktu</p>
              </div>
            )}
          </div>
          <div className={style.tableBox}>
            <Table
              selectedRow={selectedRow}
              editHandler={editHandler}
              deleteHandler={() => setPopupIsOpen(true)}
              selectedRowHandler={(id) => setSelectedRow(id)}
              data={data.products.map((item) => {
                return {
                  ...item,
                  supplier: item.supplier.name,
                };
              })}
              format={[
                "supplier",
                "name",
                "type",
                "capacity",
                "unit",
                "pricePerUnit",
              ]}
              titles={[
                "Dostawca",
                "Nazwa",
                "Typ",
                "Pojemność",
                "Jednostka",
                "Cena za jednostkę",
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

export default ProductsPage;
