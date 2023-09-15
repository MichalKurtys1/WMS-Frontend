import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import {
  GET_PRODUCTS,
  GET_SUPPLIERS,
} from "../../../utils/apollo/apolloQueries";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { selectValidator } from "../../../utils/inputValidators";

import style from "./DeliveriesAddPage.module.css";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { FaAngleLeft } from "react-icons/fa";
import ProductList from "../ProductsList";
import Spinner from "../../../components/Spiner";
import ErrorHandler from "../../../components/ErrorHandler";
import { ADD_DELIVERY, ADD_STOCK } from "../../../utils/apollo/apolloMutations";

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

const DeliveriesAddPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [error, setError] = useState();
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS, {
    onError: (error) => setError(error),
  });
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
  });
  const [options, setOptions] = useState([]);
  const [productList, setProductList] = useState(
    location.state !== null
      ? location.state.savedData.products
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );
  const [addDelivery] = useMutation(ADD_DELIVERY);
  const [addStock] = useMutation(ADD_STOCK);

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

  const addProductInputCounter = () => {
    setProductList((prevList) => [
      ...prevList,
      { id: prevList.length, product: null, unit: null, quantity: null },
    ]);
  };

  const deleteHandler = ({ id }) => {
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getSupplierHandler = () => {
    const supplier = data.suppliers.filter(
      (item) => item.name === location.state.savedData.supplierId
    );
    return supplier[0].name;
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

    if (incompleteProducts.length > 0) {
      setSubmitError(true);
      return;
    }

    addDelivery({
      variables: {
        supplierId: values.supplier,
        expectedDate: values.date,
        warehouse: values.magazine,
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

    setSubmitError(false);
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
      <ErrorHandler error={error} />
      {(loadingSuppliers || loadingProducts) && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {(!loadingSuppliers || !loadingProducts) && (
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
                        min={getCurrentDateTime()}
                        width="90%"
                        initVal={
                          location.state !== null
                            ? location.state.savedData.date
                            : null
                        }
                      />
                    </div>
                    <div className={style.column}>
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
      )}
    </div>
  );
};

export default DeliveriesAddPage;
