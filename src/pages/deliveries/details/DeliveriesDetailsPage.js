import { useLocation, useNavigate } from "react-router";
import style from "./DeliveriesDetailsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";

const ADD_DELIVERY = gql`
  mutation Mutation(
    $supplierId: ID!
    $date: String!
    $warehouse: String!
    $comments: String!
    $products: JSON!
  ) {
    createDelivery(
      supplierId: $supplierId
      date: $date
      warehouse: $warehouse
      comments: $comments
      products: $products
    ) {
      id
      supplierId
      date
      warehouse
      comments
      products
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

const UPDATE_PRODUCT = gql`
  mutation Mutation($updateAvailableStockId: String!, $availableStock: Float!) {
    updateAvailableStock(
      id: $updateAvailableStockId
      availableStock: $availableStock
    )
  }
`;

const DeliveriesDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addDelivery] = useMutation(ADD_DELIVERY);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  let totalPrice = 0;

  const submitHandler = () => {
    addDelivery({
      variables: {
        supplierId: location.state.supplierId,
        date: location.state.date,
        warehouse: location.state.warehouse,
        comments: location.state.comments,
        products: location.state.products,
      },
    })
      .then((data) => {
        JSON.parse(location.state.products).forEach((item) => {
          const product = location.state.productsFromDB.products.filter(
            (product) =>
              item.product.includes(product.name) &&
              item.product.includes(product.type) &&
              item.product.includes(product.capacity)
          );
          updateProduct({
            variables: {
              updateAvailableStockId: product[0].id,
              availableStock: parseInt(item.quantity),
            },
          }).catch((err) => console.log(err));
        });

        navigate("/main/deliveries", {
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
              navigate("/main/deliveries");
            } else {
              navigate("/main/deliveries/add", {
                state: {
                  savedData: {
                    supplierId: location.state.supplierId,
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

export default DeliveriesDetailsPage;
