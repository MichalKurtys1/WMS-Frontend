import { Form } from "react-final-form";
import Input from "../../../components/Input";
import style from "./DeliveriesAddPage.module.css";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import { useEffect, useState } from "react";

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

const productItemsList = ["Wybierz produkt", "Item1", "Item2", "Item3"];
const unitItemsList = [
  "Wybierz jednostkę",
  "szt",
  "zgrzewka(4szt)",
  "zgrzewka(6szt)",
  "zgrzewka(8szt)",
  "zgrzewka(12szt)",
  "zgrzewka(16szt)",
  "zgrzewka(24szt)",
];

const selectValidator = (value) => {
  if (!value || value.includes("Wybierz")) {
    return "Wybierz jedną z opcji";
  }
};

const DeliveriesAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState(false);
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS);
  const [options, setOptions] = useState([]);
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, name: null, unit: null, quantity: null }];
    }
  });

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
        item.quantity === null ||
        item.unit === null ||
        item.quantity === ""
    );

    if (incompleteProducts.length > 0) {
      setSubmitError(true);
      return;
    }

    navigate("/main/deliveries/details", {
      state: {
        supplierId: values.supplier,
        date: values.date,
        warehouse: values.magazine,
        comments: values.comments,
        products: JSON.stringify(productList),
      },
    });

    setSubmitError(false);
  };

  const getSupplierHandler = () => {
    const supplier = data.suppliers.filter(
      (item) => item.name === location.state.savedData.supplierId
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
          onClick={() => navigate("/main/deliveries")}
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
                  {data !== undefined && !loadingSuppliers && (
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
                          {productItemsList.map((option) => {
                            if (option === item.name) {
                              return (
                                <option selected value={option}>
                                  {option}
                                </option>
                              );
                            } else {
                              return <option value={option}>{option}</option>;
                            }
                          })}
                        </select>
                      </div>
                    </div>
                    <div className={style.selectBox}>
                      <div className={style.selectBox}>
                        <select
                          defaultValue={item.unit}
                          className={style.select}
                          onChange={(event) =>
                            changeUnitHandler(item.id, event.target.value)
                          }
                        >
                          {unitItemsList.map((option) => (
                            <option value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
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

export default DeliveriesAddPage;
