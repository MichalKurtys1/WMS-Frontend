import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_DELIVERY, ADD_STOCK } from "../../../utils/apollo/apolloMutations";
import { GET_PRODUCTS } from "../../../utils/apollo/apolloQueries";

import style from "./DeliveriesDetailsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";

const DeliveriesDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [addDelivery] = useMutation(ADD_DELIVERY);
  const [addStock] = useMutation(ADD_STOCK);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);

  const submitHandler = () => {
    addDelivery({
      variables: {
        supplierId: location.state.supplierId,
        expectedDate: location.state.date,
        warehouse: location.state.warehouse,
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
          addStock({
            variables: {
              productId: product[0].id,
              ordered: parseInt(item.quantity),
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

  const priceHandler = (name) => {
    const product = products.products.filter(
      (item) => item.name + " " + item.type + " " + item.capacity === name
    );
    return product[0].pricePerUnit;
  };

  const vatSum = () => {
    let totalVat = 0;
    JSON.parse(location.state.products).map((item) => {
      return (totalVat = totalVat +=
        priceHandler(item.product) * item.quantity * 0.23);
    });
    return totalVat.toFixed(2);
  };

  const priceSum = () => {
    let totalPrice = 0;
    JSON.parse(location.state.products).map((item) => {
      return (totalPrice = totalPrice +=
        priceHandler(item.product) * item.quantity);
    });
    return totalPrice.toFixed(2);
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
        <div className={style.upperBox}>
          <div className={style.logoBox}>
            <img src={require("../../../assets/logo.png")} alt="company logo" />
          </div>
          <div className={style.datesData}>
            <div className={style.row}>
              <h4>Miejsce wystawienia</h4>
              <p>Bydgoszcz</p>
            </div>
            <div className={style.row}>
              <h4>Data zakończenia dostawy</h4>
              <p>
                {/* {location.state.date
                  ? dateToPolish(new Date(location.state.date).getTime())
                  : dateToPolish(location.state.dateNumber)} */}
              </p>
            </div>
            <div className={style.row}>
              <h4>Data wystawienia</h4>
              <p>{/* {dateToPolish(new Date().getTime())} */}</p>
            </div>
          </div>
        </div>
        <div className={style.personalData}>
          <div className={style.companyData}>
            <h2>Sprzedawca</h2>
            <p>{location.state.supplier.name}</p>
            <p>
              {"ul. " +
                location.state.supplier.street +
                " " +
                location.state.supplier.number +
                " " +
                location.state.supplier.city}
            </p>
            <p>NIP: {location.state.supplier.nip}</p>
            <p>{location.state.supplier.bank}</p>
            <p>{location.state.supplier.accountNumber}</p>
            <p>
              {location.state.supplier.email} Tel:
              {location.state.supplier.phone}
            </p>
          </div>
          <div className={style.companyData}>
            <h2>Nabywca</h2>
            <p>Oaza napojów Sp. z.o.o.</p>
            <p>ul. Cicha 2 Bydgoszcz</p>
            <p>NIP: 1112233444</p>
          </div>
        </div>
        <h1>FAKTURA VAT 211/08/2023</h1>
        <div className={style.tablesBox}>
          <table className={style.invoiceTable}>
            <thead>
              <tr>
                <th>Lp</th>
                <th>Nazwa</th>
                <th>Ilość</th>
                <th>j.m.</th>
                <th>Cena brutto</th>
                <th>VAT [%]</th>
                <th>VAT</th>
                <th>Wartość brutto</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                !loadingProducts &&
                JSON.parse(location.state.products).map((item) => (
                  <tr>
                    <td>{item.id + 1}</td>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>
                      {priceHandler(item.product, item.quantity).toFixed(2)} zł
                    </td>
                    <td>23</td>
                    <td>
                      {(
                        (priceHandler(item.product) * item.quantity).toFixed(
                          2
                        ) * 0.23
                      ).toFixed(2)}{" "}
                      zł
                    </td>
                    <td>
                      {(priceHandler(item.product) * item.quantity).toFixed(2)}{" "}
                      zł
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className={style.summaryTable}>
            <table className={style.invoiceTable}>
              <thead>
                <tr>
                  <th>według stawki VAT</th>
                  <th>wartość netto</th>
                  <th>kwota VAT</th>
                  <th>wartość brutto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Podstawowy podatek VAT 23%</td>
                  <td>{priceSum()} zł</td>
                  <td>{vatSum()} zł</td>
                  <td>{+priceSum() + +vatSum()} zł</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={style.summaryBox}>
            <div className={style.upperBox}>
              <p>Razem do zapłaty:</p>
              <p>{+priceSum() + +vatSum()} zł</p>
            </div>
          </div>
        </div>
        <div className={style.signatureBox}>
          <div className={style.signature}>
            <h4>Wystawił(a):</h4>
            <p>Jan Kowalski</p>
          </div>
          <div className={style.signature}>
            <h4>Odebrał(a):</h4>
            <p> </p>
          </div>
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
