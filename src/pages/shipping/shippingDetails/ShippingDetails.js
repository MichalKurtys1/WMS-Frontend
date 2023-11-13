import style from "./ShippingDetails.module.css";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  ORDER_FILE_UPLOAD,
  UPDATE_SHIPPMENT_WAYBILL,
  FORMATTED_SHIPPING_DATA,
} from "../../../utils/apollo/apolloMutations";
import ErrorHandler from "../../../components/ErrorHandler";
import { pdf } from "@react-pdf/renderer";
import ShippmentPDF from "../../PDFs/ShippmentPDF";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import { GET_ORDERS_SHIPMENTS } from "../../../utils/apollo/apolloMultipleQueries";

const ShippingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [getFormattedData, { loading }] = useMutation(FORMATTED_SHIPPING_DATA, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const { data, loading: loadingData } = useQuery(GET_ORDERS_SHIPMENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [orderFileUpload] = useMutation(ORDER_FILE_UPLOAD, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [updateOrderShipmentWaybill] = useMutation(UPDATE_SHIPPMENT_WAYBILL, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (!location.state) return;

    getFormattedData({
      variables: {
        getFormattedDataId: location.state.deliveryId,
      },
    }).then((data) => {
      if (!data.data) return;
      setProducts(data.data.getFormattedData.products);
      setOrders(data.data.getFormattedData.orders);
    });
  }, [getFormattedData, location.state]);

  const modifyWeightValue = (id, value) => {
    setProducts((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, weight: value } : item
      )
    );
  };

  const openPdfHandler = async (shipping) => {
    const blob = await pdf(<ShippmentPDF shippingData={shipping} />).toBlob();
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
    });

    const serializedShipping = JSON.stringify(shipping);
    localStorage.setItem("shippingData", serializedShipping);
    window.open("http://localhost:3000/pdf/shippment", "_blank", "noopener");
    navigate("/shipping", {
      state: {
        updated: true,
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const shipment = data.shipments.find(
      (item) => item.id === location.state.deliveryId
    );

    let shipping = JSON.parse(JSON.parse(shipment.orders)).map((element) => {
      let order = data.orders.find((item) => item.id === element.id);
      let clientAddress =
        order.client.street +
        " " +
        order.client.number +
        " " +
        order.client.city;
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
        updateShipmentWaybillId: location.state.deliveryId,
        waybill: shipping,
      },
    }).then((data) => {
      if (!data.data) return;
      openPdfHandler(shipping);
    });
  };

  return (
    <div className={style.container}>
      <Header path={"/shipping"} />
      <ErrorHandler error={error} />
      <Loading state={(loading || loadingData) && !error} />
      {orders && (
        <div className={style.detailsBox}>
          <h1>Dane przesyłki</h1>
          <form onSubmit={onSubmit}>
            {products &&
              products.map((item) => (
                <div className={style.productBox}>
                  <p>{item.product}</p>
                  <p>
                    <strong>{item.quantity}x</strong> {item.unit}
                  </p>
                  <input
                    type="number"
                    placeholder="Waga"
                    min={1}
                    required
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
