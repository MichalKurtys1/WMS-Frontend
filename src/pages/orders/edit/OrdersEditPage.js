import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { dateToInput } from "../../../utils/dateFormatters";
import { selectValidator } from "../../../utils/inputValidators";
import {
  GET_ORDER,
  UPDATE_ORDER,
  UPDATE_STOCK,
} from "../../../utils/apollo/apolloMutations";
import {
  GET_CLIENTS,
  GET_PRODUCTS,
  GET_STOCKS,
} from "../../../utils/apollo/apolloQueries";

import style from "./OrdersEditPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import ProductList from "../../orders/ProductsList";
import ErrorHandler from "../../../components/ErrorHandler";

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
  const [error, setError] = useState();
  const [options, setOptions] = useState();
  const [deliveryData, setDeliveryData] = useState();
  const [getOrder, { loading }] = useMutation(GET_ORDER, {
    onError: (error) => setError(error),
  });
  const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER, {
    onError: (error) => setError(error),
  });
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
  });
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS, {
    onError: (error) => setError(error),
  });
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, product: null, unit: null, quantity: null }];
    }
  });
  const [updateStock] = useMutation(UPDATE_STOCK, {
    onError: (error) => setError(error),
  });
  const { data: stocks, loading: loadingStocks } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
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
        expectedDate: values.date,
        warehouse: values.magazine,
        products: JSON.stringify(productList),
      },
    })
      .then((data) => {
        productList.forEach((item) => {
          const stock = stocks.stocks.filter(
            (stock) =>
              item.product.includes(stock.product.name) &&
              item.product.includes(stock.product.type) &&
              item.product.includes(stock.product.capacity)
          );
          console.log(stock[0].availableStock);
          console.log(item.maxValue);
          console.log(item.quantity);
          let newValue =
            parseInt(stock[0].availableStock) +
            (parseInt(item.maxValue) - parseInt(item.quantity));

          if (newValue < 0) {
            setError("SERVER_ERROR");
            return;
          }
          updateStock({
            variables: {
              updateStockId: stock[0].id,
              availableStock: newValue,
            },
          })
            .then((data) => {
              navigate("/main/orders", {
                state: {
                  userData: data.data,
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
      <ErrorHandler error={error} />
      {(loadingClients ||
        loadingProducts ||
        loading ||
        updateLoading ||
        loadingStocks) && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {data && deliveryData && stocks && (
        <main>
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
                        initVal={dateToInput(deliveryData.expectedDate)}
                      />
                    </div>
                    <div className={style.column}>
                      <div className={style.selectBox}>
                        <Select
                          fieldName="magazine"
                          validator={selectValidator}
                          initVal={deliveryData.warehouse}
                          options={warehouseList}
                        />
                      </div>
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
                  </div>
                </div>
                <div className={style.productData}>
                  <p>Produkty</p>
                </div>
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
                    stocks={stocks}
                  />
                </div>
              </form>
            )}
          />
        </main>
      )}
    </div>
  );
};

export default OrdersEditPage;
