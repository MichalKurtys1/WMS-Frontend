import { Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { dateToInput } from "../../../utils/dateFormatters";
import { selectValidator } from "../../../utils/inputValidators";
import {
  GET_ORDER,
  ORDER_FILE_UPLOAD,
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
import OrderPDF from "../../PDFs/OrderPDF";
import { pdf } from "@react-pdf/renderer";

const OrdersEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(false);
  const [error, setError] = useState();
  const [options, setOptions] = useState();
  const [deliveryData, setDeliveryData] = useState();
  const [sumbitLoading, setSumbitLoading] = useState(false);
  const [productList, setProductList] = useState(() => {
    if (location.state !== null) {
      return [];
    } else {
      return [{ id: 0, product: null, unit: null, quantity: null }];
    }
  });
  const [getOrder, { loading }] = useMutation(GET_ORDER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateStock, { loading: loadingUpdateStocks }] = useMutation(
    UPDATE_STOCK,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const {
    data: stocks,
    loading: loadingStocks,
    refetch,
  } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [orderFileUpload, { loading: loadingUploadFile }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
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

  useEffect(() => {
    getOrder({ variables: { getOrderId: location.state.orderId } }).then(
      (data) => {
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
      }
    );
  }, [getOrder, location.state.orderId]);

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

  const openPdfHandler = async (id, date, client) => {
    const order = {
      deliveryDate: new Date(date).getTime(),
      issueDate: new Date().getTime(),
      issuePlace: "Bydgoszcz",
      seller: {
        name: client.name,
        address:
          "ul. " + client.street + " " + client.number + " " + client.city,
        nip: "NIP: " + client.nip,
        bank: client.bank,
        account: client.accountNumber,
        emailTel: client.email + " Tel: " + client.phone,
      },
      buyer: {
        name: "Oaza napojów Sp. z.o.o.",
        address: "ul. Cicha 2 Bydgoszcz",
        nip: "NIP: 1112233444",
      },
      productsInfo: products,
      products: productList,
    };
    const blob = await pdf(<OrderPDF deliveryData={order} />).toBlob();
    const generateRandomString = (length) => {
      const characters = "0123456789";
      let result = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }

      return result;
    };

    let number = generateRandomString(8);

    await orderFileUpload({
      variables: {
        file: new File([blob], number + ".pdf"),
        name: `FAKTURA/${
          new Date(order.deliveryDate).toISOString().split("T")[0]
        }/${number}`,
        fileUploadId: id,
        date: new Date(),
      },
    });

    const serializedDelivery = JSON.stringify(order);
    localStorage.setItem("deliveryData", serializedDelivery);
    window.open("http://localhost:3000/pdf/order", "_blank", "noreferrer");

    setSumbitLoading(false);

    navigate("/orders", {
      state: {
        userData: data,
      },
    });
  };

  const onSubmit = (values) => {
    setSumbitLoading(true);

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

    let totalPrice = 0;
    productList.forEach((item) => {
      const product = products.products.find(
        (products) =>
          item.product.includes(products.name) &&
          item.product.includes(products.type) &&
          item.product.includes(products.capacity)
      );
      totalPrice +=
        +item.quantity * +product.pricePerUnit * 1.4 +
        +item.quantity * +product.pricePerUnit * 1.4 * 0.23;
    });

    updateOrder({
      variables: {
        updateOrderId: location.state.orderId,
        clientId: values.client,
        expectedDate: values.date,
        products: JSON.stringify(productList),
        totalPrice,
      },
    }).then(async (dataa) => {
      if (!dataa.data) return;
      await openPdfHandler(
        dataa.data.updateOrder.id,
        values.date,
        data.clients.filter((item) => item.name === values.client)[0]
      );

      JSON.parse(JSON.parse(deliveryData.products)).forEach(async (item) => {
        const stock = stocks.stocks.find(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );

        let newValue = +stock.availableStock + +item.quantity;

        await updateStock({
          variables: {
            updateStockId: stock.id,
            availableStock: newValue,
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

          let newValue =
            parseInt(stock.availableStock) - parseInt(item.quantity);

          await updateStock({
            variables: {
              updateStockId: stock.id,
              availableStock: newValue < 0 ? 0 : newValue,
            },
          });
        });
      });
    });

    setSubmitError(false);
  };

  const getSupplierHandler = () => {
    const client = data.clients.filter(
      (item) => item.id === deliveryData.clientId
    );
    return client[0].name;
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
        <div className={style.returnBox} onClick={() => navigate("/orders")}>
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {(loadingClients ||
        loadingProducts ||
        loading ||
        updateLoading ||
        loadingUpdateStocks ||
        loadingUploadFile ||
        loadingStocks) &&
        sumbitLoading &&
        !error && <Spinner />}
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
                    <div className={style.input}>
                      <Select
                        fieldName="client"
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
