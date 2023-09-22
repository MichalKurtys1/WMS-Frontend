import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../utils/apollo/apolloQueries";
import { DELETE_PRODUCT } from "../../utils/apollo/apolloMutations";

import style from "./ProductsPage.module.css";
import Table from "../../components/table/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../components/ErrorHandler";
import Spinner from "../../components/Spiner";
import { getAuth } from "../../context/index";

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      {successMsg && (
        <div className={style.succes}>
          <p>Produkt usunięty pomyślnie</p>
        </div>
      )}
      {loading && !error && <Spinner />}
      {data && data.products && (
        <main>
          <div className={style.optionPanel}>
            <h1>Lista produktów</h1>
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
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć ten produkt z systemu?"
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

export default ProductsPage;
