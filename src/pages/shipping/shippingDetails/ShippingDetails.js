import style from "./ShippingDetails.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GET_ORDER,
  ORDER_FILE_UPLOAD,
  UPDATE_ORDERSHIPPMENT_WAYBILL,
  UPDATE_SHIPMENT_STATE,
} from "../../../utils/apollo/apolloMutations";
import ErrorHandler from "../../../components/ErrorHandler";
import {
  GET_ORDERS,
  GET_ORDER_SHIPMENTS,
} from "../../../utils/apollo/apolloQueries";
import { pdf } from "@react-pdf/renderer";
import ShippmentPDF from "../../PDFs/ShippmentPDF";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";

const ShippingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [getOrder, { loading }] = useMutation(GET_ORDER, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data: orderShipment } = useQuery(GET_ORDER_SHIPMENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [orderFileUpload] = useMutation(ORDER_FILE_UPLOAD, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateOrderShipmentWaybill] = useMutation(
    UPDATE_ORDERSHIPPMENT_WAYBILL,
    {
      onError: (error) => setError(error),
      onCompleted: () => setError(false),
    }
  );
  const { data: orders } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateShipmentState] = useMutation(UPDATE_SHIPMENT_STATE, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (!orderShipment || !location.state) return;

    const shipment = orderShipment.orderShipments.find(
      (item) => item.id === location.state.deliveryId
    );
    setProducts([]);
    setData([]);
    JSON.parse(JSON.parse(shipment.orders)).forEach((item) => {
      getOrder({
        variables: {
          getOrderId: item.id,
        },
      }).then((data) => {
        if (!data.data) return;
        setData((prevList) => [...prevList, data.data.getOrder]);
        JSON.parse(JSON.parse(data.data.getOrder.products)).map((item) => {
          return setProducts((prevList) => [
            ...prevList,
            {
              orderId: data.data.getOrder.id,
              id: prevList.length,
              product: item.product,
              unit: item.unit,
              quantity: item.quantity,
              delivered: 0,
              damaged: 0,
            },
          ]);
        });
      });
    });
  }, [getOrder, location.state, orderShipment]);

  const modifyWeightValue = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, weight: value } : item
      )
    );
  };

  const openPdfHandler = async (shipping) => {
    const blob = await pdf(<ShippmentPDF shipment={shipping} />).toBlob();
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
        name: `LIST PRZEWOZOWY/${shipping[0].deliveryDate}/${number}`,
        fileUploadId: location.state.deliveryId,
        date: new Date(),
      },
    }).catch((err) => {
      console.log(err);
    });

    const serializedShipping = JSON.stringify(shipping);
    localStorage.setItem("shippingData", serializedShipping);
    window.open("http://localhost:3000/pdf/shippment", "_blank", "noreferrer");
    navigate("/shipping", {
      state: {
        updated: true,
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const shipment = orderShipment.orderShipments.find(
      (item) => item.id === location.state.deliveryId
    );

    let shipping = JSON.parse(JSON.parse(shipment.orders)).map((element) => {
      let order = orders.orders.find((item) => item.id === element.id);
      let clientAddress =
        order.client.street +
        " " +
        order.client.number +
        " " +
        order.client.city;
      console.log(order.products);
      let product = products.filter((item) => item.orderId === order.id);

      return {
        employeeName: shipment.employee,
        registrationNumber: shipment.registrationNumber,
        deliveryDate: shipment.deliveryDate,
        warehouseAddress: "ul. Cicha 2 Bydgoszcz",
        orderId: order.id,
        clientName: order.client.name,
        clientAddress: clientAddress,
        destinationAddress: clientAddress,
        products: product,
      };
    });

    updateOrderShipmentWaybill({
      variables: {
        updateOrderShipmentWaybillId: location.state.deliveryId,
        waybill: shipping,
      },
    }).then((data) => {
      if (!data.data) return;
      updateShipmentState({
        variables: {
          updateOrderShipmentStateId: location.state.deliveryId,
          state: "Wysłano",
        },
      }).then((data) => {
        openPdfHandler(shipping);
      });
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/shipping"} />
      <ErrorHandler error={error} />
      <Loading state={loading && !error} />
      {data && (
        <div className={style.detailsBox}>
          <h1>Dane przesyłki</h1>
          <form onSubmit={onSubmit}>
            {data &&
              products.map((item) => (
                <div className={style.productBox}>
                  <p>{item.product}</p>
                  <p>
                    <strong>{item.quantity}x</strong> {item.unit}
                  </p>
                  <input
                    type="number"
                    placeholder="Waga"
                    onChange={(event) =>
                      modifyWeightValue(item.id, event.target.value)
                    }
                  />
                </div>
              ))}

            <button type="submit" className={style.sendBtn}>
              Potwierdź
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShippingDetails;
