import { PDFViewer } from "@react-pdf/renderer";
import PicklistPDF from "./PicklistPDF";
import { useEffect } from "react";
import { useState } from "react";

const PicklistRenderer = () => {
  const [picklistData, setPicklistData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("picklistData")) {
      setPicklistData(JSON.parse(localStorage.getItem("picklistData")));
      console.log(JSON.parse(localStorage.getItem("picklistData")));
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
      {picklistData.length !== 0 && (
        <PDFViewer width={"100%"} height={"100%"} d>
          <PicklistPDF picklistData={picklistData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default PicklistRenderer;
