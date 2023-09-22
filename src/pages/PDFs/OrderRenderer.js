import { PDFViewer } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import { useEffect } from "react";
import { useState } from "react";

const OrderRenderer = () => {
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("deliveryData")) {
      setDeliveryData(JSON.parse(localStorage.getItem("deliveryData")));
      console.log(JSON.parse(localStorage.getItem("deliveryData")));
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
        <PDFViewer width={"100%"} height={"100%"} d>
          <OrderPDF deliveryData={deliveryData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default OrderRenderer;
