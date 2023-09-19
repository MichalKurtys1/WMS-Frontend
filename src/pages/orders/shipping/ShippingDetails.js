import { FaAngleLeft } from "react-icons/fa";
import style from "./ShippingDetails.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  ADD_SHIPPING,
  GET_ORDER,
  UPDATE_ORDER_STATE,
} from "../../../utils/apollo/apolloMutations";
import ErrorHandler from "../../../components/ErrorHandler";

const palletList = ["1000 x 1200", "1016 x 1219", "1165 x 1165", "800 x 1200"];

const ShippingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [palletNumber, setPalletNumber] = useState();
  const [palletWeight, setPalletWeight] = useState();
  const [palletSize, setPalletSize] = useState();
  const [getOrder] = useMutation(GET_ORDER, {
    onError: (error) => setError(error),
  });
  const [addShipping] = useMutation(ADD_SHIPPING, {
    onError: (error) => setError(error),
  });
  const [updateOrdersState] = useMutation(UPDATE_ORDER_STATE, {
    onError: (error) => setError(error),
  });

  useEffect(() => {
    getOrder({
      variables: {
        getOrderId: location.state.deliveryId,
      },
    })
      .then((data) => {
        setData(data.data.getOrder);
        setProducts([]);
        JSON.parse(JSON.parse(data.data.getOrder.products)).map((item) => {
          return setProducts((prevList) => [
            ...prevList,
            {
              id: prevList.length,
              product: item.product,
              unit: item.unit,
              quantity: item.quantity,
              delivered: 0,
              damaged: 0,
            },
          ]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getOrder, location.state.deliveryId]);

  const changeNumberHandler = (event) => {
    setPalletNumber(event.target.value);
  };

  const changeWeightHandler = (event) => {
    setPalletWeight(event.target.value);
  };

  const changeSizeHandler = (event) => {
    setPalletSize(event.target.value);
  };

  const sendHandler = (e) => {
    e.preventDefault();
    addShipping({
      variables: {
        orderId: location.state.deliveryId,
        totalWeight: palletWeight,
        palletSize: palletSize,
        palletNumber: palletNumber,
        products: JSON.stringify(products),
      },
    })
      .then((data) => {
        updateOrdersState({
          variables: {
            updateOrderStateId: location.state.deliveryId,
            state: "Do wysyłki",
          },
        })
          .then((data) => {
            navigate("/shipping");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
      <div className={style.detailsBox}>
        <h1>Dane przewozowe</h1>
        <form onSubmit={sendHandler}>
          <input
            type="number"
            placeholder="Ilość palet"
            value={palletNumber}
            onChange={changeNumberHandler}
          />
          <input
            type="number"
            placeholder="Waga całkowita"
            value={palletWeight}
            onChange={changeWeightHandler}
          />
          <div className={style.selectBox}>
            <select
              className={style.select}
              value={palletSize}
              onChange={changeSizeHandler}
            >
              <option value={null}>Wybierz jednostkę</option>
              {palletList.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={style.sendBtn}>
            Potwierdź
          </button>
        </form>
        <div className={style.productBox}>Produkty</div>
        {data &&
          products.map((item) => (
            <div className={style.products}>
              <p>{item.product}</p>
              <p>
                <strong>{item.quantity}x</strong> {item.unit}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShippingDetails;
