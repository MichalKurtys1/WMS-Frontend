import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../utils/apollo/apolloQueries";
import { DELETE_PRODUCT } from "../../utils/apollo/apolloMutations";

import style from "./ProductsPage.module.css";
import Table from "../../components/Table";
import PopUp from "../../components/PopUp";
import { FaUserPlus, FaAngleLeft } from "react-icons/fa";

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

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

    deleteProduct({
      variables: {
        deleteProductId: selectedRow,
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
    navigate(`/main/products/edit`, {
      state: {
        userId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    navigate(`/main/products/details`, {
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
          <p>Produkt usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Lista produktów</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/main/products/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodawanie produktu</p>
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
                "availableStock",
              ]}
              titles={[
                "Dostawca",
                "Nazwa",
                "Typ",
                "Pojemność",
                "Jednostka",
                "Cena za jednostkę",
                "Stan magazynowy",
              ]}
            />
          )}
        </div>
      </main>
      {popupIsOpen && (
        <PopUp
          message={
            "Czy jesteś pewien, że chcesz usunąć usunąć ten produkt z systemu?"
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

export default ProductsPage;
