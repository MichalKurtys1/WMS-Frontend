import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./OrdersAddPage.module.css";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import { useEffect, useState } from "react";

const GET_CLIENTS = gql`
  query Query {
    clients {
      id
      name
      phone
      email
      city
      street
      number
      nip
    }
  }
`;

const GET_PRODUCT = gql`
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

const selectValidator = (value) => {
  if (!value || value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }
};

const OrdersAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState(false);
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCT);
  const [options, setOptions] = useState([]);

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
    if (location.state !== null) {
      setProductList(location.state.savedData.products);
    }
  }, [data, location.state]);

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
        item.quantity === ""
    );
    console.log(incompleteProducts);
    if (incompleteProducts.length > 0) {
      setSubmitError(true);
      return;
    }

    navigate("/main/orders/details", {
      state: {
        clientId: values.client,
        date: values.date,
        warehouse: values.magazine,
        comments: values.comments || "",
        products: JSON.stringify(productList),
      },
    });

    setSubmitError(false);
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
                <h1>Dodawanie dostawy</h1>
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
                            options={[
                              { name: "Wybierz Magazyn", value: null },
                              { name: "Centralny", value: "Centralny" },
                              {
                                name: "ul. Cicha 2 Bydgoszcz",
                                value: "ul. Cicha 2",
                              },
                              {
                                name: "ul. Głośna 12 Bydgoszcz",
                                value: "ul. Głośna 12",
                              },
                            ]}
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
                {productList.map((item) => (
                  <div className={style.productBox}>
                    <BsTrashFill
                      className={style.trashIcon}
                      onClick={() => deleteHandler(item.id)}
                    />
                    <div className={style.selectBox}>
                      <div className={style.selectBox}>
                        <select
                          defaultValue={item.product}
                          className={style.select}
                          onChange={(event) =>
                            changeProductHandler(item.id, event.target.value)
                          }
                        >
                          <option value={null}>Wybierz produkt</option>
                          {products &&
                            !loadingProducts &&
                            products.products.map((option) => {
                              if (option.name === item.name) {
                                return (
                                  <option
                                    selected
                                    value={
                                      option.name +
                                      " " +
                                      option.type +
                                      " " +
                                      option.capacity
                                    }
                                  >
                                    {option.name} {option.type}{" "}
                                    {option.capacity}
                                  </option>
                                );
                              } else {
                                return (
                                  <option
                                    value={
                                      option.name +
                                      " " +
                                      option.type +
                                      " " +
                                      option.capacity
                                    }
                                  >
                                    {option.name} {option.type}{" "}
                                    {option.capacity}
                                  </option>
                                );
                              }
                            })}
                        </select>
                      </div>
                    </div>
                    {item.product !== null &&
                      item.product !== "Wybierz produkt" && (
                        <div className={style.selectBox}>
                          <div className={style.selectBox}>
                            <select
                              defaultValue={item.unit}
                              className={style.select}
                              onChange={(event) =>
                                changeUnitHandler(item.id, event.target.value)
                              }
                            >
                              <option value={null}>Wybierz jednostkę</option>
                              {products &&
                                !loadingProducts &&
                                products.products.map((option) => {
                                  if (
                                    option.name +
                                      " " +
                                      option.type +
                                      " " +
                                      option.capacity ===
                                    item.product
                                  ) {
                                    return (
                                      <option value={option.unit}>
                                        {option.unit}
                                      </option>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                            </select>
                          </div>
                        </div>
                      )}
                    <div className={style.inputBox}>
                      <input
                        defaultValue={item.quantity}
                        type="number"
                        min={0}
                        placeholder="Ilość"
                        onChange={(event) =>
                          quantityUnitHandler(item.id, event.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <div
                  className={style.productBox}
                  onClick={addProductInputCounter}
                >
                  <FaPlus className={style.plusIcon} />
                </div>
              </div>
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default OrdersAddPage;