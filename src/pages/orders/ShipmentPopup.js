import style from "./ShipmentPopup.module.css";

const ShipmentPopup = ({ shipmentPopupOpen, transportTypeHandler }) => {
  return (
    <>
      {shipmentPopupOpen && (
        <div className={style.popup}>
          <h1>Wybierz sposób dostarczenia</h1>
          <div className={style.buttons}>
            <button onClick={() => transportTypeHandler("personal")}>
              <img
                src={require("../../assets/delivery.png")}
                alt="personal collect"
              />
              <p>Odbiór osobisty</p>
            </button>
            <button onClick={() => transportTypeHandler("shipment")}>
              <img src={require("../../assets/truck.png")} alt="shipment" />
              <p>Dowóz</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentPopup;
