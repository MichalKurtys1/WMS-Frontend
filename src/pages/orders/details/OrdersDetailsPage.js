import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_ORDER,
  ORDER_FILE_UPLOAD,
  UPDATE_STOCK,
} from "../../../utils/apollo/apolloMutations";
import { GET_PRODUCTS, GET_STOCKS } from "../../../utils/apollo/apolloQueries";

import style from "./OrdersDetailsPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import { useState } from "react";
import ErrorHandler from "../../../components/ErrorHandler";
import { pdf } from "@react-pdf/renderer";
import OrderPDF from "../../PDFs/OrderPDF";

const OrdersDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [addOrder] = useMutation(ADD_ORDER);
  const [error, setError] = useState();
  const { data: products, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  const [updateStock] = useMutation(UPDATE_STOCK, {
    onError: (error) => setError(error),
  });
  const { data: stocks } = useQuery(GET_STOCKS, {
    onError: (error) => setError(error),
  });
  const [orderFileUpload] = useMutation(ORDER_FILE_UPLOAD, {
    onError: (error) => setError(error),
  });

  const openPdfHandler = async (id) => {
    console.log(location.state);
    const order = {
      deliveryDate: new Date(location.state.date).getTime(),
      issueDate: new Date().getTime(),
      issuePlace: "Bydgoszcz",
      seller: {
        name: location.state.client.name,
        address:
          "ul. " +
          location.state.client.street +
          " " +
          location.state.client.number +
          " " +
          location.state.client.city,
        nip: "NIP: " + location.state.client.nip,
        bank: location.state.client.bank,
        account: location.state.client.accountNumber,
        emailTel:
          location.state.client.email + " Tel: " + location.state.client.phone,
      },
      buyer: {
        name: "Oaza napojów Sp. z.o.o.",
        address: "ul. Cicha 2 Bydgoszcz",
        nip: "NIP: 1112233444",
      },
      productsInfo: products,
      products: JSON.parse(location.state.products),
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

    orderFileUpload({
      variables: {
        file: new File([blob], number + ".pdf"),
        name: `FAKTURA/${
          new Date(order.deliveryDate).toISOString().split("T")[0]
        }/${number}`,
        fileUploadId: id,
        date: new Date(),
      },
    }).catch((err) => {
      console.log(err);
    });

    const serializedDelivery = JSON.stringify(order);
    localStorage.setItem("deliveryData", serializedDelivery);
    window.open("http://localhost:3000/pdf/order", "_blank", "noreferrer");
  };

  const submitHandler = () => {
    addOrder({
      variables: {
        clientId: location.state.clientId,
        expectedDate: location.state.date,
        warehouse: location.state.warehouse,
        products: location.state.products,
      },
    })
      .then((data) => {
        openPdfHandler(data.data.createOrder.id);
        JSON.parse(location.state.products).forEach((item) => {
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
          console.log(stock[0].availableStock);
          console.log(newValue);
          updateStock({
            variables: {
              updateStockId: stock[0].id,
              availableStock: newValue,
            },
          })
            .then((data) => {
              navigate("/main/orders", {
                state: {
                  userData: data.data,
                },
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(location.state);
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
          onClick={() => {
            if (location.state !== null && location.state.details) {
              navigate("/main/orders");
            } else {
              navigate("/main/orders/add", {
                state: {
                  savedData: {
                    supplierId: location.state.supplierId,
                    date: location.state.date,
                    warehouse: location.state.warehouse,
                    comments: location.state.comments,
                    products: JSON.parse(location.state.products),
                  },
                },
              });
            }
          }}
        >
          <FaAngleLeft className={style.icon} />
          <p>Powrót</p>
        </div>
      </div>
      <ErrorHandler error={error} />
      {!(location.state !== null && location.state.details) && (
        <main>
          <button className={style.confirmBtn} onClick={submitHandler}>
            Potwierdź
          </button>
        </main>
      )}
    </div>
  );
};

export default OrdersDetailsPage;
