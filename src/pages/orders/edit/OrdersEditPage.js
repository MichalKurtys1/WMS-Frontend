import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { dateToInput } from "../../../utils/dateFormatters";
import { selectValidator } from "../../../utils/inputValidators";
import {
  GET_ORDER,
  UPDATE_AVAILABLE_STOCK,
  UPDATE_ORDER,
} from "../../../utils/apollo/apolloMutations";
import { GET_CLIENTS, GET_PRODUCTS } from "../../../utils/apollo/apolloQueries";

import style from "./OrdersEditPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import Input from "../../../components/Input";
import ProductList from "../../orders/ProductsList";

const warehouseList = [
  { name: "Wybierz Magazyn" },
  { name: "Centralny" },
  {
    name: "ul. Cicha 2 Bydgoszcz",
  },
  {
    name: "ul. Głośna 12 Bydgoszcz",
  },
];

const OrdersEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [getOrder] = useMutation(GET_ORDER);
  const [updateOrder, { loading, error }] = useMutation(UPDATE_ORDER);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS);
  const [deliveryData, setDeliveryData] = useState();
  const [updateAvailableStock] = useMutation(UPDATE_AVAILABLE_STOCK);
  const [options, setOptions] = useState();
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, product: null, unit: null, quantity: null }];
    }
  });

  useEffect(() => {
    if (data && !loadingClients) {
      setOptions([
        { name: "Wybierz Klienta", value: null },
        ...data.clients.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [data, loadingClients]);

  useEffect(() => {
    getOrder({ variables: { getOrderId: location.state.orderId } })
      .then((data) => {
        setDeliveryData(data.data.getOrder);
        const oldDeliveries = JSON.parse(
          JSON.parse(data.data.getOrder.products)
        ).map((item) => {
          return {
            ...item,
            maxValue: item.quantity,
          };
        });
        setProductList(oldDeliveries);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getOrder, location.state.orderId]);

  const addProductInputCounter = () => {
    setProductList((prevList) => [
      ...prevList,
      { id: prevList.length, product: null, unit: null, quantity: null },
    ]);
  };

  const deleteHandler = (id) => {
    setProductList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const changeProductHandler = (id, product) => {
    setProductList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, product } : item))
    );
  };

  const changeUnitHandler = (id, unit) => {
    setProductList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, unit } : item))
    );
  };

  const quantityUnitHandler = (id, quantity) => {
    setProductList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const onSubmit = (values) => {
    const state = productList.filter(
      (item) =>
        item.product === null ||
        item.quantity === null ||
        item.unit === null ||
        item.quantity === "" ||
        products.products.filter(
          (option) =>
            option.name + " " + option.type + " " + option.capacity ===
            item.product
        )[0].availableStock +
          parseInt(item.maxValue) <
          parseInt(item.quantity)
    );
    if (state.length > 0) {
      setSubmitError(true);
      return;
    }

    updateOrder({
      variables: {
        updateOrderId: location.state.orderId,
        clientId: values.client,
        date: values.date,
        warehouse: values.magazine,
        comments: values.comments,
        products: JSON.stringify(productList),
      },
    })
      .then((data) => {
        productList.forEach((item) => {
          const product = products.products.filter(
            (product) =>
              item.product.includes(product.name) &&
              item.product.includes(product.type) &&
              item.product.includes(product.capacity)
          );
          updateAvailableStock({
            variables: {
              updateAvailableStockId: product[0].id,
              availableStock:
                (parseInt(item.quantity) - parseInt(item.maxValue)) * -1,
            },
          })
            .then((data) => {
              navigate("/main/orders", {
                state: {
                  userData: data.data.createClient,
                },
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setSubmitError(false);
  };

  const getSupplierHandler = () => {
    const client = data.clients.filter(
      (item) => item.id === deliveryData.clientId
    );
    return client[0].name;
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
          onClick={() => navigate("/main/orders")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <main>
        {error && error.message === "EMAIL TAKEN" && (
          <p className={style.errorText}>Podany email jest już zajęty</p>
        )}
        {error && error.message === "SERVER_ERROR" && (
          <p>Wystapił nieoczekiwany problem. Spróbuj ponownie za chwilę</p>
        )}
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, invalid }) => (
            <form className={style.form} onSubmit={handleSubmit}>
              <div className={style.basicInfoBox}>
                <h1>Edytowanie dostawy</h1>
                <div className={style.basicData}>
                  <p>Dane podstawowe</p>
                </div>
                <div className={style.inputBox}>
                  {loading && (
                    <div className={style.spinnerBox}>
                      <div className={style.spinner}>
                        <Spinner />
                      </div>
                    </div>
                  )}
                  {deliveryData && !loading && (
                    <>
                      <div className={style.column}>
                        <div className={style.selectBox}>
                          <Select
                            fieldName="client"
                            validator={selectValidator}
                            initVal={
                              location.state !== null
                                ? getSupplierHandler()
                                : null
                            }
                            options={options || []}
                          />
                        </div>
                        <Input
                          name="date"
                          type="datetime-local"
                          fieldName="date"
                          width="90%"
                          initVal={dateToInput(deliveryData.date)}
                        />
                        <div className={style.selectBox}>
                          <Select
                            fieldName="magazine"
                            validator={selectValidator}
                            initVal={deliveryData.warehouse}
                            options={warehouseList}
                          />
                        </div>
                      </div>
                      <div className={style.column}>
                        <TextArea
                          name="Dodatkowe informacje"
                          type="text"
                          fieldName="comments"
                          width="100%"
                          initVal={deliveryData.comments}
                        />
                        <button
                          disabled={invalid}
                          type="submit"
                          style={{
                            backgroundColor: invalid ? "#B6BABF" : null,
                          }}
                        >
                          Edytuj
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className={style.productData}>
                <p>Produkty</p>
              </div>
              {deliveryData && !loading && (
                <div className={style.productContainer}>
                  {submitError && (
                    <div className={style.error}>
                      <p>Uzupełnij wszystkie produkty lub usuń niepotrzebne.</p>
                    </div>
                  )}
                  <ProductList
                    productList={productList}
                    products={products}
                    loadingProducts={loadingProducts}
                    submitError={submitError}
                    deleteHandler={deleteHandler}
                    changeProductHandler={changeProductHandler}
                    changeUnitHandler={changeUnitHandler}
                    quantityUnitHandler={quantityUnitHandler}
                    addProductInputCounter={addProductInputCounter}
                  />
                </div>
              )}
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default OrdersEditPage;
