import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { selectValidator, textValidator } from "../../utils/inputValidators";

import style from "../styles/ordDelAddEditPages.module.css";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ProductList from "./ProductsList";
import ErrorHandler from "../../components/ErrorHandler";
import { ADD_DELIVERY } from "../../utils/apollo/apolloMutations";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { BiErrorAlt } from "react-icons/bi";
import { GET_PRODUCTS_SUPPLIERS } from "../../utils/apollo/apolloMultipleQueries";

const DeliveriesAddPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [error, setError] = useState();
  const [options, setOptions] = useState([]);
  const [productList, setProductList] = useState(
    location.state !== null
      ? location.state.savedData.products
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );
  const { data, loading } = useQuery(GET_PRODUCTS_SUPPLIERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [addDelivery] = useMutation(ADD_DELIVERY, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (data && !loading) {
      setOptions([
        { name: "Wybierz Dostawcę", value: null },
        ...data.suppliers.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [data, loading]);

  const deleteHandler = ({ id }) => {
    setProductList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const addProductInputCounter = () => {
    setProductList((prevList) => [
      ...prevList,
      { id: prevList.length, product: null, unit: null, quantity: null },
    ]);
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

    addDelivery({
      variables: {
        supplierId: values.supplier,
        expectedDate: values.date,
        warehouse: values.magazine,
        products: JSON.stringify(productList),
        totalPrice: totalPrice,
      },
    }).then((data) => {
      if (!data.data) return;
      navigate("/deliveries", {
        state: {
          userData: true,
        },
      });
    });
    setSubmitError(false);
  };

  return (
    <div className={style.container}>
      <Header path={"/deliveries"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {!loading && (
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
                    <div className={style.input}>
                      <Select
                        name={"Wybierz Dostawcę"}
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
                        validator={textValidator}
                        fieldName="date"
                        min={getCurrentDateTime()}
                        width="90%"
                        margin={true}
                        initVal={
                          location.state !== null
                            ? location.state.savedData.date
                            : null
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
                      Dalej
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
                    loadingProducts={loading}
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

export default DeliveriesAddPage;
