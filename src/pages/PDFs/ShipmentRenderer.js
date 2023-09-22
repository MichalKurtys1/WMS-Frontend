import { PDFViewer } from "@react-pdf/renderer";
import { useEffect } from "react";
import { useState } from "react";
import ShippmentPDF from "./ShippmentPDF";

const ShipmentRenderer = () => {
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("shippingData")) {
      setDeliveryData(JSON.parse(localStorage.getItem("shippingData")));
      console.log(JSON.parse(localStorage.getItem("shippingData")));
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
          <ShippmentPDF shipment={deliveryData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ShipmentRenderer;
