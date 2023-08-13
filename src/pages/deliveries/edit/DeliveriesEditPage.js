import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  GET_DELIVERY,
  UPDATE_DELIVERY,
  UPDATE_STOCK,
} from "../../../utils/apollo/apolloMutations";
import {
  GET_PRODUCTS,
  GET_STOCKS,
  GET_SUPPLIERS,
} from "../../../utils/apollo/apolloQueries";
import { selectValidator } from "../../../utils/inputValidators";
import { dateToInput } from "../../../utils/dateFormatters";

import style from "./DeliveriesEditPage.module.css";
import Spinner from "../../../components/Spiner";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import ProductList from "../ProductsList";
import { FaAngleLeft } from "react-icons/fa";
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

const DeliveriesEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [deliveryData, setDeliveryData] = useState();
  const [options, setOptions] = useState();
  const [error, setError] = useState();
  const [getDelivery, { loading }] = useMutation(GET_DELIVERY, {
    onError: (error) => setError(error),
  });
  const [updateDelivery, { loading: updateLoading }] = useMutation(
    UPDATE_DELIVERY,
    {
      onError: (error) => setError(error),
    }
  );
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
  });
  const { data: stocks } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
  });
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS, {
    onError: (error) => setError(error),
  });
  const [updateStock] = useMutation(UPDATE_STOCK, {
    onError: (error) => setError(error),
  });
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, product: null, unit: null, quantity: null }];
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

  console.log(productList);

  const addProductInputCounter = () => {
    setProductList((prevList) => [
      ...prevList,
      {
        id: deletedProducts.length + prevList.length,
        product: null,
        unit: null,
        quantity: null,
      },
    ]);
  };

  const deleteHandler = (id) => {
    setDeletedProducts((prevList) => [
      ...prevList,
      productList.filter((item) => item.id === id),
    ]);
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
    console.log(productList);
    console.log(deletedProducts);
    updateDelivery({
      variables: {
        updateDeliveryId: location.state.deliveryId,
        supplierId: values.supplier,
        expectedDate: values.date,
        warehouse: values.magazine,
        comments: values.comments,
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
          let newValue;
          if (item.maxValue) {
            newValue =
              parseInt(stock[0].ordered) -
              parseInt(item.maxValue) +
              parseInt(item.quantity);
          } else {
            newValue = parseInt(stock[0].ordered) + parseInt(item.quantity);
          }
          console.log(newValue);
          if (newValue < 0) {
            setError("SERVER_ERROR");
            return;
          }
          updateStock({
            variables: {
              updateStockId: stock[0].id,
              ordered: newValue,
            },
          }).catch((err) => console.log(err));
        });
        if (deletedProducts[0]) {
          // tu może być błąd
          console.log(deletedProducts[0]);
          deletedProducts[0].forEach((item) => {
            const stock = stocks.stocks.filter(
              (stock) =>
                item.product.includes(stock.product.name) &&
                item.product.includes(stock.product.type) &&
                item.product.includes(stock.product.capacity)
            );

            const newValue =
              parseInt(stock[0].ordered) - parseInt(item.quantity);
            // tu może być błąd
            console.log(stock[0].ordered);
            console.log(newValue);
            updateStock({
              variables: {
                updateStockId: stock[0].id,
                ordered: newValue,
              },
            })
              .then((data) => {
                navigate("/main/deliveries", {
                  state: {
                    userData: data.data,
                  },
                });
              })
              .catch((err) => console.log(err));
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    navigate("/main/deliveries", {
      state: {
        userData: data.data,
      },
    });
    setSubmitError(false);
  };

  const getSupplierHandler = () => {
    const supplier = data.suppliers.filter(
      (item) => item.id === deliveryData.supplierId
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
      <ErrorHandler error={error} />
      {(loadingSuppliers || loadingProducts || loading || updateLoading) && (
        <div className={style.spinnerBox}>
          <div className={style.spinner}>
            <Spinner />
          </div>
        </div>
      )}
      {data && deliveryData && (
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

export default DeliveriesEditPage;
