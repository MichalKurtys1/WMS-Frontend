import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  GET_DELIVERY,
  UPDATE_DELIVERY,
} from "../../utils/apollo/apolloMutations";
import { selectValidator } from "../../utils/inputValidators";
import { dateToInput } from "../../utils/dateFormatters";

import style from "../styles/ordDelAddEditPages.module.css";
import Select from "../../components/Select";
import Input from "../../components/Input";
import ProductList from "./ProductsList";
import ErrorHandler from "../../components/ErrorHandler";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { BiErrorAlt } from "react-icons/bi";
import { GET_PRODUCTS_SUPPLIERS } from "../../utils/apollo/apolloMultipleQueries";

const DeliveriesEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [deliveryData, setDeliveryData] = useState();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState(
    location.state !== null
      ? []
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );
  const [getDelivery, { loading }] = useMutation(GET_DELIVERY, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateDelivery, { loading: updateLoading }] = useMutation(
    UPDATE_DELIVERY,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const { data, loading: loadingSuppliers } = useQuery(GET_PRODUCTS_SUPPLIERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
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
    getDelivery({
      variables: { getDeliveryId: location.state.deliveryId },
    }).then(({ data }) => {
      if (!data) return;
      setDeliveryData(data.getDelivery);
      const oldDeliveries = JSON.parse(
        JSON.parse(data.getDelivery.products)
      ).map((item) => ({
        ...item,
        maxValue: item.quantity,
      }));
      setProductList(oldDeliveries);
    });
  }, [getDelivery, location.state.deliveryId]);

  const addProductInputCounter = () => {
    setProductList((prevList) => [
      ...prevList,
      {
        id: Math.floor(10000 + Math.random() * 90000),
        product: null,
        unit: null,
        quantity: null,
      },
    ]);
  };

  const deleteHandler = ({ id, product }) => {
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

  const changeQuantityHandler = (id, quantity) => {
    setProductList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getSupplierHandler = () => {
    if (!deliveryData) return;
    const supplier = data.suppliers.find(
      (item) => item.id === deliveryData.supplierId
    );
    return supplier ? supplier.name : null;
  };

  const onSubmit = async (values) => {
    const hasEmptyFields = productList.some(
      (item) =>
        item.product === null ||
        item.quantity === null ||
        item.unit === null ||
        item.quantity === ""
    );

    if (hasEmptyFields) {
      setSubmitError(true);
      return;
    }

    let totalPrice = 0;
    productList.forEach((item) => {
      const product = data.products.find(
        (products) =>
          item.product.includes(products.name) &&
          item.product.includes(products.type) &&
          item.product.includes(products.capacity)
      );
      totalPrice +=
        +item.quantity * +product.pricePerUnit +
        +item.quantity * +product.pricePerUnit * 0.23;
    });

    let updateDeliveryData;
    updateDelivery({
      variables: {
        updateDeliveryId: location.state.deliveryId,
        supplierId: values.supplier,
        expectedDate: values.date,
        comments: values.comments,
        products: JSON.stringify(productList),
        totalPrice,
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/deliveries", {
        state: {
          userData: updateDeliveryData,
        },
      });
      setSubmitError(false);
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={style.container}>
      <Header path={"/deliveries"} />
      <ErrorHandler error={error} />
      <Loading
        state={(loadingSuppliers || loading || updateLoading) && !error}
      />
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
                    <div className={style.input}>
                      <Select
                        fieldName="supplier"
                        validator={selectValidator}
                        initVal={
                          location.state !== null ? getSupplierHandler() : null
                        }
                        options={options || []}
                      />
                    </div>
                    <div className={style.input}>
                      <Input
                        name="date"
                        type="date"
                        fieldName="date"
                        min={getCurrentDateTime()}
                        width="90%"
                        margin={true}
                        initVal={
                          dateToInput(deliveryData.expectedDate).split("T")[0]
                        }
                      />
                    </div>
                    <button
                      disabled={invalid}
                      type="submit"
                      style={{
                        backgroundColor: invalid ? "#B6BABF" : null,
                      }}
                      data-testid="SubmitBtn"
                    >
                      Edytuj
                    </button>
                  </div>
                </div>
                <div className={style.productData}>
                  <p>Produkty</p>
                </div>
                <div className={style.productContainer}>
                  {submitError && (
                    <div className={style.error}>
                      <BiErrorAlt className={style.icon} />
                      <p>Uzupełnij wszystkie produkty lub usuń niepotrzebne.</p>
                    </div>
                  )}
                  <ProductList
                    productList={productList}
                    products={data}
                    loadingProducts={loadingSuppliers}
                    submitError={submitError}
                    deleteHandler={deleteHandler}
                    changeProductHandler={changeProductHandler}
                    changeUnitHandler={changeUnitHandler}
                    quantityUnitHandler={changeQuantityHandler}
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
