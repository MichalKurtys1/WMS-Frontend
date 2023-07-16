import { useLocation, useNavigate } from "react-router";
import style from "./OrdersDetailsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";

const ADD_ORDER = gql`
  mutation Mutation(
    $clientId: ID!
    $date: String!
    $warehouse: String!
    $comments: String!
    $products: JSON!
  ) {
    createOrder(
      clientId: $clientId
      date: $date
      warehouse: $warehouse
      comments: $comments
      products: $products
    ) {
      id
      clientId
      date
      warehouse
      comments
      products
      state
    }
  }
`;

const GET_PRODUCTS = gql`
  query Query {
    products {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
    }
  }
`;

const OrdersDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addOrder] = useMutation(ADD_ORDER);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  let totalPrice = 0;

  const submitHandler = () => {
    console.log(location.state.supplierId);
    addOrder({
      variables: {
        clientId: location.state.clientId,
        date: location.state.date,
        warehouse: location.state.warehouse,
        comments: location.state.comments,
        products: location.state.products,
      },
    })
      .then((data) => {
        navigate("/main/orders", {
          state: {
            userData: data.data.createClient,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const priceHandler = (name, quantity) => {
    const product = products.products.filter(
      (item) => item.name + " " + item.type + " " + item.capacity === name
    );
    totalPrice = totalPrice += quantity * product[0].pricePerUnit;
    return quantity * product[0].pricePerUnit;
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => {
            if (location.state !== null && location.state.details) {
              navigate("/main/orders");
            } else {
              navigate("/main/orders/add", {
                state: {
                  savedData: {
                    clientId: location.state.clientId,
                    date: location.state.date,
                    warehouse: location.state.warehouse,
                    comments: location.state.comments,
                    products: JSON.parse(location.state.products),
                  },
                },
              });
            }
          }}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <div className={style.dataBox}>
        {location.state !== null && location.state.details && (
          <h1>Szczegóły</h1>
        )}
        {!(location.state !== null && location.state.details) && (
          <h1>Podsumowanie</h1>
        )}
        <div className={style.basicData}>
          <p>Dane podstawowe</p>
        </div>
        <div className={style.basicDataBox}>
          <div className={style.infoBox}>
            <h3>Dostawca</h3>
            <p>{location.state.supplierId}</p>
          </div>
          <div className={style.infoBox}>
            <h3>Termin</h3>
            <p>{location.state.date}</p>
          </div>
          <div className={style.infoBox}>
            <h3>Magazyn</h3>
            <p>{location.state.warehouse}</p>
          </div>
          <div className={style.infoBox}>
            <h3>Uwagi</h3>
            <p>{location.state.comments}</p>
          </div>
        </div>
        <div className={style.basicData}>
          <p>Produkty</p>
        </div>
        <div className={style.productBox}>
          <div className={style.titlesBox}>
            <p>Produkt</p>
            <p>Ilość</p>
            <p>Cena</p>
          </div>
          {products &&
            !loadingProducts &&
            JSON.parse(location.state.products).map((item) => (
              <div className={style.product}>
                <p>{item.product}</p>
                <p>
                  {item.quantity}x {item.unit}
                </p>
                <p>{priceHandler(item.product, item.quantity)} zł</p>
              </div>
            ))}
        </div>
        <div className={style.summary}>
          <p>Razem</p>
        </div>
        <div className={style.summaryValue}>
          <p>{totalPrice} zł</p>
        </div>
      </div>
      {!(location.state !== null && location.state.details) && (
        <button className={style.confirmBtn} onClick={submitHandler}>
          Potwierdź
        </button>
      )}
    </div>
  );
};

export default OrdersDetailsPage;
