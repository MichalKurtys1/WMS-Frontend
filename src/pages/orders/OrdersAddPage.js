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
import {
  ADD_ORDER,
  ORDER_FILE_UPLOAD,
} from "../../utils/apollo/apolloMutations";
import OrderPDF from "../PDFs/OrderPDF";
import { pdf } from "@react-pdf/renderer";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { BiErrorAlt } from "react-icons/bi";
import { GET_CLIENTS_STOCK_PRODUCTS } from "../../utils/apollo/apolloMultipleQueries";

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
  const { data, loading } = useQuery(GET_CLIENTS_STOCK_PRODUCTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [addOrder, { loading: addLoading }] = useMutation(ADD_ORDER, {
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
      productsInfo: data,
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
    window.open("http://localhost:3000/pdf/order", "_blank", "noopener");

    setSumbitLoading(false);

    navigate("/orders", {
      state: {
        userData: data.data,
      },
    });
  };

  useEffect(() => {
    if (data && !loading) {
      setOptions([
        { name: "Wybierz Klienta", value: null },
        ...data.clients.map((item) => ({
          name: item.name,
          value: item.name,
        })),
      ]);
    }
  }, [data, loading]);

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
        item.quantity === "" ||
        data.products.filter(
          (option) =>
            option.name + " " + option.type + " " + option.capacity ===
            item.product
        )[0].availableStock < parseInt(item.quantity)
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
        +item.quantity * +product.pricePerUnit * 1.4 +
        +item.quantity * +product.pricePerUnit * 1.4 * 0.23;
    });

    addOrder({
      variables: {
        clientId: values.client,
        expectedDate: values.date,
        products: JSON.stringify(productList),
        totalPrice: totalPrice,
      },
    }).then(async (dataa) => {
      if (!dataa.data) return;
      await openPdfHandler(
        dataa.data.createOrder.id,
        values.date,
        data.clients.filter((item) => item.name === values.client)[0]
      );
    });
    setSubmitError(false);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getSupplierHandler = () => {
    const supplier = data.clients.filter(
      (item) => item.name === location.state.savedData.supplierId
    );
    return supplier ? supplier[0].name : null;
  };

  return (
    <div className={style.container}>
      <Header path={"/orders"} />
      <Loading
        state={
          (sumbitLoading || loading || uploadLoading || addLoading) && !error
        }
      />
      <ErrorHandler error={error} />
      {(!loading || uploadLoading || addLoading) && data && (
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
                    <div className={style.input}>
                      <Select
                        name={"Wybierz Klienta"}
                        fieldName="client"
                        validator={selectValidator}
                        initVal={
                          location.state && location.state.savedData.supplierId
                            ? getSupplierHandler()
                            : null
                        }
                        options={options || []}
                      />
                    </div>
                    <div className={style.input}>
                      <Input
                        name="date"
                        type="date"
                        fieldName="date"
                        validator={textValidator}
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
                    stocks={data}
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

export default OrdersAddPage;
