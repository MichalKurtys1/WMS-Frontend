import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import ShippmentPDF from "./ShippmentPDF";

const ShipmentRenderer = () => {
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("shippingData")) {
      setShippingData(JSON.parse(localStorage.getItem("shippingData")));
      localStorage.removeItem("shippingData");
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
      {shippingData.length !== 0 && (
        <PDFViewer width={"100%"} height={"100%"}>
          <ShippmentPDF shippingData={shippingData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ShipmentRenderer;
