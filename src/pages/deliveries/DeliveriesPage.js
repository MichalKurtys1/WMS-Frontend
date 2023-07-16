import { useLocation, useNavigate } from "react-router";
import Table from "../../components/Table";
import style from "./DeliveriesPage.module.css";
import { FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PopUp from "../../components/PopUp";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaAngleLeft } from "react-icons/fa";

const GETDELIVERIES = gql`
  query Query {
    deliveries {
      id
      supplierId
      date
      warehouse
      comments
      products
      state
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

const GET_DELIVERY = gql`
  mutation Mutation($getDeliveryId: String!) {
    getDelivery(id: $getDeliveryId) {
      id
      supplierId
      supplier {
        id
        name
      }
      date
      warehouse
      comments
      products
      state
    }
  }
`;

const DELETEDELIVERIES = gql`
  mutation Mutation($deleteDeliveryId: String!) {
    deleteDelivery(id: $deleteDeliveryId)
  }
`;

const DeliveriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { data, refetch, getError } = useQuery(GETDELIVERIES);
  const [deleteDeliveries, { deleteError }] = useMutation(DELETEDELIVERIES);
  const [getDelivery] = useMutation(GET_DELIVERY);

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

    deleteDeliveries({
      variables: {
        deleteDeliveryId: selectedRow,
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
    navigate(`/main/deliveries/edit`, {
      state: {
        deliveryId: id,
      },
    });
  };

  const detailsHandler = (id) => {
    getDelivery({ variables: { getDeliveryId: id } })
      .then((data) => {
        const products = JSON.parse(data.data.getDelivery.products);
        const date = new Date(parseInt(data.data.getDelivery.date));
        const formattedDate = `${date.getUTCFullYear()}-${(
          date.getUTCMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date
          .getUTCDate()
          .toString()
          .padStart(2, "0")}T${date
          .getUTCHours()
          .toString()
          .padStart(2, "0")}:${date
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}`;
        navigate("/main/deliveries/details", {
          state: {
            details: true,
            supplierId: data.data.getDelivery.supplier.name,
            date: formattedDate,
            warehouse: data.data.getDelivery.warehouse,
            comments: data.data.getDelivery.comments,
            products: products,
          },
        });
      })
      .catch((err) => {
        console.log(err);
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
          <p>Client usunięty pomyślnie</p>
        </div>
      )}
      <main>
        <div className={style.optionPanel}>
          <h1>Dostawy</h1>
          <div
            className={style.addOption}
            on
            onClick={() => navigate(`/main/deliveries/add`)}
          >
            <FaUserPlus className={style.icon} />
            <p>Dodaj nowe</p>
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
              data={data.deliveries.map((item) => {
                const date = new Date(parseInt(item.date));
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                };
                const polishDate = date.toLocaleString("pl-PL", options);
                return {
                  ...item,
                  date: polishDate,
                  supplier: item.supplier.name,
                };
              })}
              format={["supplier", "date", "warehouse", "comments", "state"]}
              titles={["Dostawca", "Termin", "Magazyn", "Uwagi", "Stan"]}
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

export default DeliveriesPage;
