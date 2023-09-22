import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router";
import {
  GET_CLIENTS,
  GET_PRODUCTS,
  GET_STOCKS,
} from "../../../utils/apollo/apolloQueries";
import { selectValidator } from "../../../utils/inputValidators";

import style from "./OrdersAddPage.module.css";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import ProductList from "../ProductsList";
import { FaAngleLeft } from "react-icons/fa";
import ErrorHandler from "../../../components/ErrorHandler";
import {
  ADD_ORDER,
  ORDER_FILE_UPLOAD,
  UPDATE_STOCK,
} from "../../../utils/apollo/apolloMutations";
import OrderPDF from "../../PDFs/OrderPDF";
import { pdf } from "@react-pdf/renderer";
import Spinner from "../../../components/Spiner";

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
  const [options, setOptions] = useState([]);
  const [error, setError] = useState();
  const [sumbitLoading, setSumbitLoading] = useState(false);
  const [productList, setProductList] = useState(
    location.state !== null
      ? location.state.savedData.products
      : [{ id: 0, product: null, unit: null, quantity: null }]
  );
  const { data, loading: loadingClients } = useQuery(GET_CLIENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: stocks, loading: loadingStock } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [addOrder, { loading: addLoading }] = useMutation(ADD_ORDER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateStock, { loading: updateLoading }] = useMutation(UPDATE_STOCK, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [orderFileUpload, { loading: uploadLoading }] = useMutation(
    ORDER_FILE_UPLOAD,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );

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
        userData: data.data,
      },
    });
  };

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

  const changeQuantityHandler = (id, quantity, max) => {
    if (quantity > max) {
      setSubmitError(true);
      return;
    }
    setSubmitError(false);
    setProductList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const onSubmit = (values) => {
    setSumbitLoading(true);
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
    if (incompleteProducts.length > 0 || submitError) {
      setSubmitError(true);
      return;
    }

    addOrder({
      variables: {
        clientId: values.client,
        expectedDate: values.date,
        warehouse: values.magazine,
        products: JSON.stringify(productList),
      },
    }).then(async (dataa) => {
      if (!dataa.data) return;
      await openPdfHandler(
        dataa.data.createOrder.id,
        values.date,
        data.clients.filter((item) => item.name === values.client)[0]
      );

      productList.forEach((item) => {
        const stock = stocks.stocks.filter(
          (stock) =>
            item.product.includes(stock.product.name) &&
            item.product.includes(stock.product.type) &&
            item.product.includes(stock.product.capacity)
        );
        let newValue =
          parseInt(stock[0].availableStock) - parseInt(item.quantity);

        if (newValue < 0) {
          setError("SERVER_ERROR");
          return;
        }
        updateStock({
          variables: {
            updateStockId: stock[0].id,
            availableStock: newValue,
          },
        });
      });
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
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getSupplierHandler = () => {
    console.log(data.clients);
    const supplier = data.clients.filter(
      (item) => item.name === location.state.savedData.supplierId
    );
    return supplier ? supplier[0].name : null;
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
      {sumbitLoading && !error && <Spinner />}
      <ErrorHandler error={error} />
      {(!loadingClients ||
        !loadingProducts ||
        !loadingStock ||
        uploadLoading ||
        addLoading ||
        updateLoading) &&
        data && (
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
                      <div className={style.column}>
                        <div className={style.selectBox}>
                          <Select
                            fieldName="client"
                            validator={selectValidator}
                            initVal={
                              location.state &&
                              location.state.savedData.supplierId
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
                        <p>
                          Uzupełnij wszystkie produkty lub usuń niepotrzebne.
                        </p>
                      </div>
                    )}
                    <ProductList
                      productList={productList}
                      products={products}
                      stocks={stocks}
                      loadingProducts={loadingProducts}
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

export default OrdersAddPage;
