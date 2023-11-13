import { PDFViewer } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import { useEffect, useState } from "react";

const OrderRenderer = () => {
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("deliveryData")) {
      setDeliveryData(JSON.parse(localStorage.getItem("deliveryData")));
      localStorage.removeItem("deliveryData");
    }
  }, []);

  return (
    <div
      style={{
        height: "101%",
        width: "101%",
        overflow: "hidden",
        position: "absolute",
        top: "-1%",
        left: "-1%",
      }}
    >
      {deliveryData.length !== 0 && (
        <PDFViewer width={"100%"} height={"100%"}>
          <OrderPDF deliveryData={deliveryData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default OrderRenderer;
