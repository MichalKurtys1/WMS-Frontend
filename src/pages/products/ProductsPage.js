import { useLocation, useNavigate } from "react-router";
import Table from "../../components/Table";
import style from "./ProductsPage.module.css";
import { FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PopUp from "../../components/PopUp";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaAngleLeft } from "react-icons/fa";

const GETPRODUCTS = gql`
  query Query {
    products {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
      supplier {
        id
        name
        phone
        email
        city
        street
        number
      }
    }
  }
`;

const DELETEPRODUCT = gql`
  mutation Mutation($deleteProductId: String!) {
    deleteProduct(id: $deleteProductId)
  }
`;

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch, getError } = useQuery(GETPRODUCTS);
  const [deleteProduct, { deleteError }] = useMutation(DELETEPRODUCT);

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
      {deleteError && (
        <div className={style.error}>
          <p>Wystąpił nieoczekiwany błąd</p>
        </div>
      )}
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
          {data && data !== null && (
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
          )}
          {getError && (
            <div className={style.error}>
              <p>Wystąpił nieoczekiwany błąd</p>
            </div>
          )}
          {data && data === null && (
            <div className={style.error}>
              <p>Wystąpił nieoczekiwany błąd</p>
            </div>
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
