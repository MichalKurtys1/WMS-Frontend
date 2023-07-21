import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { GET_CLIENTS, GET_PRODUCTS } from "../../../utils/apollo/apolloQueries";
import { selectValidator } from "../../../utils/inputValidators";

import style from "./OrdersAddPage.module.css";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import ProductList from "../ProductsList";
import { FaAngleLeft } from "react-icons/fa";

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

const OrdersAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState(false);
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  const [options, setOptions] = useState([]);
  const [productList, setProductList] = useState(
    location.state !== null
      ? location.state.savedData.products
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );

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
    const incompleteProducts = productList.filter(
      (item) =>
        item.product === null ||
        item.product === "Wybierz produkt" ||
        item.product === undefined ||
        item.quantity === null ||
        item.unit === null ||
        item.unit === "Wybierz jednostkę" ||
        item.unit === undefined ||
        item.quantity === "" ||
        products.products.filter(
          (option) =>
            option.name + " " + option.type + " " + option.capacity ===
            item.product
        )[0].availableStock < parseInt(item.quantity)
    );

    if (incompleteProducts.length > 0) {
      setSubmitError(true);
      return;
    }

    navigate("/main/orders/details", {
      state: {
        clientId: values.client,
        date: values.date,
        client: data.clients.filter((item) => item.name === values.client)[0],
        warehouse: values.magazine,
        comments: values.comments || "",
        products: JSON.stringify(productList),
        productsFromDB: products,
      },
    });
    setSubmitError(false);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    console.log(`${year}-${month}-${day}T${hours}:${minutes}`);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getSupplierHandler = () => {
    const supplier = data.clients.filter(
      (item) => item.name === location.state.savedData.clientId
    );
    return supplier[0].name;
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
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, invalid }) => (
            <form className={style.form} onSubmit={handleSubmit}>
              <div className={style.basicInfoBox}>
                <h1>Dodawanie zamównienia</h1>
                <div className={style.basicData}>
                  <p>Dane podstawowe</p>
                </div>
                <div className={style.inputBox}>
                  {data !== undefined && !loadingClients && (
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
                          min={getCurrentDateTime()}
                          width="90%"
                          initVal={
                            location.state !== null
                              ? location.state.savedData.date
                              : null
                          }
                        />
                        <div className={style.selectBox}>
                          <Select
                            fieldName="magazine"
                            validator={selectValidator}
                            initVal={
                              location.state !== null
                                ? location.state.savedData.warehouse
                                : null
                            }
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
                          initVal={
                            location.state !== null
                              ? location.state.savedData.comments
                              : null
                          }
                        />
                        <button
                          disabled={invalid}
                          type="submit"
                          style={{
                            backgroundColor: invalid ? "#B6BABF" : null,
                          }}
                        >
                          Dalej
                        </button>
                      </div>
                    </>
                  )}
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
                  deleteHandler={deleteHandler}
                  changeProductHandler={changeProductHandler}
                  changeUnitHandler={changeUnitHandler}
                  quantityUnitHandler={quantityUnitHandler}
                  addProductInputCounter={addProductInputCounter}
                />
              </div>
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default OrdersAddPage;
