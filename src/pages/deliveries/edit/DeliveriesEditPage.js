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

const DeliveriesEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [deliveryData, setDeliveryData] = useState();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
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
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: stocks, refetch } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data, loading: loadingSuppliers } = useQuery(GET_SUPPLIERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateStock] = useMutation(UPDATE_STOCK, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [productList, setProductList] = useState(
    location.state !== null
      ? []
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );

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
    const supplier = data.suppliers.find(
      (item) => item.id === deliveryData.supplierId
    );
    return supplier ? supplier.name : null;
  };
  console.log(location.state.deliveryId);
  console.log(JSON.stringify(error, null, 2));
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
      const product = products.products.find(
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
      JSON.parse(JSON.parse(deliveryData.products)).forEach(async (item) => {
        const stock = stocks.stocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = +stock.ordered - +item.quantity;

        await updateStock({
          variables: {
            updateStockId: stock.id,
            ordered: newValue,
          },
        });
      });

      refetch().then((newStock) => {
        productList.forEach(async (item) => {
          const stock = newStock.data.stocks.find(
            (stock) =>
              item.product.includes(stock.product.name) &&
              item.product.includes(stock.product.type) &&
              item.product.includes(stock.product.capacity)
          );

          let newValue = parseInt(stock.ordered) + parseInt(item.quantity);

          await updateStock({
            variables: {
              updateStockId: stock.id,
              ordered: newValue,
            },
          });
        });
      });
      //     (stock) =>
      //       item.product.includes(stock.product.name) &&
      //       item.product.includes(stock.product.type) &&
      //       item.product.includes(stock.product.capacity)
      //   );

      //   let newValue;
      //   if (item.maxValue) {
      //     newValue =
      //       parseInt(stock.ordered) -
      //       parseInt(item.maxValue) +
      //       parseInt(item.quantity);
      //   } else {
      //     newValue = parseInt(stock.ordered) + parseInt(item.quantity);
      //   }

      //   updateStock({
      //     variables: {
      //       updateStockId: stock.id,
      //       ordered: newValue < 0 ? 0 : newValue,
      //     },
      //   });
      // });

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
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../../assets/logo.png")}
          alt="logo"
        />
        <div
          className={style.returnBox}
          onClick={() => navigate("/deliveries")}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(loadingSuppliers || loadingProducts || loading || updateLoading) &&
        !error && <Spinner />}
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
