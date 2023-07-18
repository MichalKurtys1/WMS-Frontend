import { Form } from "react-final-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import style from "./DeliveriesEditPage.module.css";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import Input from "../../../components/Input";

const UPDATE_DELIVERY = gql`
  mutation Mutation(
    $updateDeliveryId: ID!
    $supplierId: ID!
    $date: String!
    $warehouse: String!
    $comments: String!
    $products: JSON!
  ) {
    updateDelivery(
      id: $updateDeliveryId
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

const GET_SUPPLIERS = gql`
  query Query {
    suppliers {
      id
      name
      phone
      email
      city
      street
      number
    }
  }
`;

const GET_DELIVERY = gql`
  mutation Mutation($getDeliveryId: String!) {
    getDelivery(id: $getDeliveryId) {
      id
      supplierId
      date
      warehouse
      comments
      products
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

const UPDATE_PRODUCT = gql`
  mutation Mutation($updateAvailableStockId: String!, $availableStock: Float!) {
    updateAvailableStock(
      id: $updateAvailableStockId
      availableStock: $availableStock
    )
  }
`;

const selectValidator = (value) => {
  if (!value || value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }
};

const DeliveriesEditPage = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [getDelivery] = useMutation(GET_DELIVERY);
  const [updateDelivery, { loading, error }] = useMutation(UPDATE_DELIVERY);
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCT);
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS);
  const location = useLocation();
  const [deliveryData, setDeliveryData] = useState();
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, product: null, unit: null, quantity: null }];
    }
  });
  const [options, setOptions] = useState();

  useEffect(() => {
    if (data && !loadingSuppliers) {
      setOptions([
        { name: "Wybierz Dostawcę", value: null },
        ...data.suppliers.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [data, loadingSuppliers]);

  useEffect(() => {
    getDelivery({ variables: { getDeliveryId: location.state.deliveryId } })
      .then((data) => {
        setDeliveryData(data.data.getDelivery);
        const oldDeliveries = JSON.parse(
          JSON.parse(data.data.getDelivery.products)
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
  }, [getDelivery, location.state.deliveryId]);

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
        item.quantity === ""
    );
    if (state.length > 0) {
      setSubmitError(true);
      return;
    }

    updateDelivery({
      variables: {
        updateDeliveryId: location.state.deliveryId,
        supplierId: values.supplier,
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
          updateProduct({
            variables: {
              updateAvailableStockId: product[0].id,
              availableStock: parseInt(item.quantity) - parseInt(item.maxValue),
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
        navigate("/main/deliveries", {
          state: {
            userData: data.data.createClient,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setSubmitError(false);
  };

  const formattedDate = () => {
    const date = new Date(parseInt(deliveryData.date));
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}T${date
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  const getSupplierHandler = () => {
    const supplier = data.suppliers.filter(
      (item) => item.id === deliveryData.supplierId
    );
    console.log(supplier[0].name);
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
          onClick={() => navigate("/main/deliveries")}
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
                            fieldName="supplier"
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
                          initVal={formattedDate()}
                        />
                        <div className={style.selectBox}>
                          <Select
                            fieldName="magazine"
                            validator={selectValidator}
                            initVal={deliveryData.warehouse}
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
              )}
            </form>
          )}
        />
      </main>
    </div>
  );
};

export default DeliveriesEditPage;
